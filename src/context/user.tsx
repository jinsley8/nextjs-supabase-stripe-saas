import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

type ContextType = any;

const Context = createContext<ContextType>({});

const Provider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getUserProfile = async () => {
 
            const { data: { user: sessionUser  } } = await supabase.auth.getUser();

            console.log("sessionUser", sessionUser);

            if (sessionUser) {
                const { data: profile } = await supabase
                    .from("profile")
                    .select("*")
                    .eq("id", sessionUser?.id)
                    .single();

                    console.log("PROFILE", profile)

                setUser({
                    ...sessionUser,
                    ...profile,
                });

                setIsLoading(false);
            }
        };

        getUserProfile();

        supabase.auth.onAuthStateChange(() => {
            getUserProfile();
        });
    }, []);

    const login = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "github",
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/");
    };

    const exposed = {
        user,
        login,
        logout,
        isLoading
    };

    return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;