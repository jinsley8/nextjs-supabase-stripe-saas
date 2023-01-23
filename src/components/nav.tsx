import Link from "next/link";
import { useUserContext } from "@/context/user";

const Nav = () => {
    const { user } = useUserContext();

    return (
        <nav className="flex py-4 px-6 border-b border-gray-200">
            <Link href="/">
                Home
            </Link>
            {!!user && (
                <Link href="/dashboard" legacyBehavior>
                    <a className="ml-2">Dashboard</a>
                </Link>
            )}
            <Link href="/pricing" legacyBehavior>
                <a className="ml-2">Pricing</a>
            </Link>
            <Link href={user ? "/logout" : "/login"} legacyBehavior>
                <a className="ml-auto">{user ? "Logout" : "Login"}</a>
            </Link>
        </nav>
    );
};

export default Nav;