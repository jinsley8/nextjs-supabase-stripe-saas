import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { baseURL } from '@/helper/getBaseUrl';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'POST') {
        const { priceId } = req.query;

        // Create authenticated Supabase Client
        const supabaseServerClient = createServerSupabaseClient<Database>({
            req,
            res,
        });

        // Check if we have a session
        const {
            data: { session },
        } = await supabaseServerClient.auth.getSession();

        if (!session) {
            return res.status(401).send("Unauthorized");
        }

        try {
            const {
                data,
            } = await supabaseServerClient
                .from("profile")
                .select("stripe_customer")
                .eq("id", session?.user.id)
                .single();

            if (!data) {
                return res.status(404).send("Stripe customer not found");
            }

            const lineItems = [{
                price: priceId as string,
                quantity: 1,
            }];

            const stripeSession = await stripe.checkout.sessions.create({
                customer: data.stripe_customer as string,
                mode: "subscription",
                payment_method_types: ["card"],
                currency: "cad",
                line_items: lineItems,
                success_url: `${baseURL}/payment/success`,
                cancel_url: `${baseURL}/payment/cancel`,
            });

            res.status(200).json({ stripeSession });
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default handler;