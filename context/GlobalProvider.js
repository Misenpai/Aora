import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getAccount } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAndUpdateAuthState = async () => {
        try {
            const account = await getAccount();
            if (account) {
                const currentUser = await getCurrentUser();
                setIsLogged(true);
                setUser(currentUser);
            } else {
                setIsLogged(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking auth state:", error);
            setIsLogged(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAndUpdateAuthState();
    }, []);

    const updateAuthState = async (newUser) => {
        if (newUser) {
            setIsLogged(true);
            setUser(newUser);
        } else {
            await checkAndUpdateAuthState();
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                loading,
                updateAuthState,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;