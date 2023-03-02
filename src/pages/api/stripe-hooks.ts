import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from "micro";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const signature = req.headers["stripe-signature"];
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;
    const reqBuffer = await buffer(req);

    const supabase = createServerSupabaseClient({ req, res }, { 
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    });

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    switch (event.type) {
        case "customer.subscription.updated":
            await supabase
                .from("profile")
                .update({
                    is_subscribed: true,
                    interval: event.data.object.items.data[0].plan.interval,
                })
                .eq("stripe_customer", event.data.object.customer);
            break;
        case "customer.subscription.deleted":
            await supabase
                .from("profile")
                .update({
                    is_subscribed: false,
                    interval: null,
                })
                .eq("stripe_customer", event.data.object.customer);
            break;
    }

    res.send({ received: true });
};

export default handler;