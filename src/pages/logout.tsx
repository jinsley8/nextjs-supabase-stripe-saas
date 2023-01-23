import { useEffect } from "react";
import { useUserContext } from "@/context/user";

export default function Logout() {
    const { logout } = useUserContext();

    useEffect(() => {
        logout()
    }, []);

    return (
        <div className="w-full max-w-3xl mx-auto my-8 px-2 text-center">
            <p>Logging out...</p>
        </div>
    );
};