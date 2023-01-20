import { useEffect } from "react";
import { supabase } from "@/utils/supabase";

const Login = () => {
    useEffect(() => {
        async function signInWithGitHub() {
            await supabase.auth.signInWithOAuth({
                provider: 'github',
            })
        }
        signInWithGitHub();
    }, []);

    return <p>Logging in</p>;
};

export default Login;