import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
        return res.status(401).json("Not authorized to call this API");
    }

    if (req.method === 'POST') {

        // Create authenticated Supabase Client
        const supabaseServerClient = createServerSupabaseClient<Database>({
            req,
            res,
        });

        try {
            const customer = await stripe.customers.create({
                email: req.body.record.email
            });

            await supabaseServerClient
                .from('profile')
                .update({ stripe_customer: customer.id })
                .eq('id', req.body.record.id)
                .select();

            res.status(200).json({ message: `stripe customer created: ${customer.id}`});
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}

export default handler;