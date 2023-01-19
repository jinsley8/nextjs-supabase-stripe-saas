import { supabase } from "@/utils/supabase";
import { Lesson } from './index'

type Params = {
    params: {
        id: string
    }
}

export default function LessonDetails({ lesson }: { lesson: Lesson }) {
    console.log("LESSON", lesson);

    return (
        <div className="w-full max-w-3xl mx-auto my-16 px-2">
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
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