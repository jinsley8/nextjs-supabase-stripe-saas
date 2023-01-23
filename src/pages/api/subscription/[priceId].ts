import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // Create authenticated Supabase Client
    const supabaseServerClient = createServerSupabaseClient<Database>({
        req,
        res,
    });

    // Check if we have a session
    const {
        data: { session },
    } = await supabaseServerClient.auth.getSession();

    const user = session?.user;

    console.log("[priceId] - USER", user);

    if (!user) {
        return res.status(401).send("Unauthorized");
    }

    if (!session) {
        return res.status(401).send("Unauthorized");
    }

    const {
        data: stripe_customer,
    } = await supabaseServerClient
        .from("profile")
        .select("stripe_customer")
        .eq("id", user.id)
        .single();

    console.log("STRIPE customer", stripe_customer);

    res.status(200).send({
        ...user,
        stripe_customer,
    });
};

export default handler;