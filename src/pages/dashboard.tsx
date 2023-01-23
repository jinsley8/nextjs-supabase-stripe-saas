import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'
import { useUserContext } from "@/context/user";

export default function Dashboard() {
    const { user, isLoading } = useUserContext();

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
        <h1 className="text-3xl mb-6">Dashboard</h1>
        {!isLoading && (
            <p className="mb-6">
            {user?.is_subscribed
                ? `Subscribed: ${user.interval}`
                : "Not subscribed"}
            </p>
        )}
        </div>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const req = ctx.req as any;

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

    // const { data: lessons } = await supabaseServerClient.from("lesson").select("*");

	return {
		props: {
			initialSession: session,
			user: session.user,
		},
	};
};