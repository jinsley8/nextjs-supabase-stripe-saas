import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).json("Not authorized to call this API");
    }

    // Create authenticated Supabase Client
    const supabaseServerClient = createServerSupabaseClient<Database>({
        req,
        res,
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
        {
            // https://github.com/stripe/stripe-node#configuration
            apiVersion: '2022-11-15',
        }
    );

    const customer = await stripe.customers.create({
        email: req.body.record.email
    });

    const { data } = await supabaseServerClient
        .from('profile')
        .update({ stripe_customer: customer.id })
        .eq('id', req.body.record.id)
        .select();

    console.log("User Updated", data)

    res.send({ message: `stripe customer created: ${customer.id}`});
}

export default handler;