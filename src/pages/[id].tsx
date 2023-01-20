import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Video from "react-player";
import { Lesson } from './index'

type Params = {
    params: {
        id: string
    }
}

export default function LessonDetails({ lesson }: { lesson: Lesson }) {
    const [videoUrl, setVideoUrl] = useState();

    console.log("LESSON", lesson);

    const getPremiumContent = async () => {
        const { data } = await supabase
            .from("premium_content")
            .select("video_url")
            .eq("id", lesson.id)
            .single();

        setVideoUrl(data?.video_url);
    }

    useEffect(() => {
        getPremiumContent();
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto py-16 px-8">
            <h1 className="text-3xl mb-6">{lesson.title}</h1>
            <p className="mb-8">{lesson.description}</p>
            {!!videoUrl && <Video url={videoUrl} width="100%" />}
            {!videoUrl && <p className="py-6 px-4 rounded bg-purple-100 border border-solid border-violet-400 text-violet-600 text-center">Subscribe to view premium content</p>}
        </div>
    );
}

export const getStaticPaths = async () => {
    const { data: lessons } = await supabase.from("lesson").select("id");

    const paths = lessons?.map(({ id }) => ({
        params: {
            id: id.toString(),
        },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async ({ params: { id }}: Params) => {

    const { data: lesson } = await supabase.from("lesson").select().eq('id', id).single();

    return {
        props: {
            lesson,
        },
    };
};