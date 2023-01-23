import { GetServerSidePropsContext } from 'next';
import { useState, useEffect } from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Video from "react-player";
import { Database } from '@/types/database.types';
import { useUserContext } from "@/context/user";
import { Lesson } from './index';

export default function LessonDetails({ lesson }: { lesson: Lesson }) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const supabaseClient = useSupabaseClient<Database>();
    const { user } = useUserContext();

    const getPremiumContent = async () => {
        const { data } = await supabaseClient
            .from("premium_content")
            .select("video_url")
            .eq("id", lesson.id)
            .single();

        setVideoUrl(data?.video_url as string);
    }

    useEffect(() => {
        if(user && user.is_subscribed) {
            getPremiumContent();
        }
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
            <h1 className="text-3xl mb-6">{lesson?.title}</h1>
            <p className="mb-8">{lesson?.description}</p>
            {!!videoUrl && <Video url={videoUrl} width="100%" />}
            {!videoUrl && <p className="py-6 px-4 rounded bg-purple-100 border border-solid border-violet-400 text-violet-600 text-center">Subscribe to view premium content</p>}
        </div>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

    const { id } = ctx.params as { id: string};

    // Create authenticated Supabase Client
	const supabaseServerClient = createServerSupabaseClient<Database>(ctx);

	// Check if we have a session
	const {
		data: { session },
	} = await supabaseServerClient.auth.getSession();

    const { data: lesson } = await supabaseServerClient
        .from("lesson")
        .select("*")
        .eq("id", id)
        .single();

    if (!session) {
		return {
			props: {
				lesson,
			},
		}
	}

	return {
		props: {
			lesson,
            initialSession: session,
			user: session.user,
		},
	};
};