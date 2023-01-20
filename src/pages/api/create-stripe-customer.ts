import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from "@/utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
        {
            // https://github.com/stripe/stripe-node#configuration
            apiVersion: '2022-11-15',
        }
    );

    const customer = await stripe.customers.create({
        email: req.body.record.email
    });

    const { data } = await supabase
        .from('profile')
        .update({ stripe_customer: customer.id })
        .eq('id', req.body.record.id)
        .select();

    console.log("User Updated", data)

    res.send({ message: `stripe customer created: ${customer.id}`});
}

export default handler;