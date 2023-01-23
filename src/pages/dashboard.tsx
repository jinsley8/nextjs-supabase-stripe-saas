import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'
import { useUserContext } from "@/context/user";
import { useRouter } from "next/router";

export default function Dashboard() {
    const { user, isLoading } = useUserContext();
    const router = useRouter();

    const loadPortal = async () => {
        const response = await fetch("/api/portal");
        const data = await response.json();

        router.push(data.stripeSession.url);
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
        <h1 className="text-3xl mb-6">Dashboard</h1>
        {!isLoading && (
            <>
                <p className="mb-6">
                {user?.is_subscribed
                    ? `Subscribed: ${user.interval}`
                    : "Not subscribed"}
                </p>
                <button onClick={loadPortal} className="rounded-lg text-sm font-semibold py-3 px-4 mt-8 bg-violet-800 text-white hover:bg-violet-500">Manage Subscription</button>
            </>
        )}
        </div>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabaseServerClient = createServerSupabaseClient<Database>(ctx);

	// Check if we have a session
	const {
		data: { session },
	} = await supabaseServerClient.auth.getSession();

	if (!session) {
		return {
			redirect: {
                permanent: false,
                destination: "/login",
            },
            props: {},
		}
	}

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	};
};