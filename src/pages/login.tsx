import { useEffect } from "react";
import { useUserContext } from "@/context/user";

export default function Login() {
    const { login } = useUserContext();

    useEffect(() => {
        login()
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto my-8 px-2 text-center">
            <p>Logging in...</p>
        </div>
    );
};
