import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types'
import { useUserContext } from "@/context/user";

export type Lesson = {
	id: string;
	created_at: Date;
	title: string;
	description: string;
}

export default function Home({ lessons }: { lessons: Lesson[] }) {

	const { user } = useUserContext();

	return (
		<div className="w-full max-w-3xl mx-auto my-16 px-2">
			{lessons && lessons.map((lesson: Lesson) => (
				<Link key={lesson.id} href={`/${lesson.id}`} className="p-8 mb-4 rounded shadow text-xl flex">{lesson.title}</Link>
			))}
		</div>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	// Create authenticated Supabase Client
	const supabaseServerClient = createServerSupabaseClient<Database>(ctx);

	// Check if we have a session
	const {
		data: { session },
	} = await supabaseServerClient.auth.getSession();

	const { data: lessons } = await supabaseServerClient.from("lesson").select("*");

	if (!session) {
		return {
			props: {
				lessons,
			},
		}
	}

	return {
		props: {
			lessons,
			initialSession: session,
			user: session.user,
		},
	};
};