import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        try {
            const savedAuth = localStorage.getItem('auth');
            return savedAuth ? JSON.parse(savedAuth) : {};  // Safely parse or return an empty object
        } catch (error) {
            console.error("Error parsing auth data from localStorage:", error);
            return {};  // Return an empty object if there's an error
        }
    });

    // Save `auth` to localStorage whenever it changes
    useEffect(() => {
        if (auth && auth.accessToken) {
            try {
                localStorage.setItem('auth', JSON.stringify(auth));  // Save the whole auth object, including accessToken
            } catch (error) {
                console.error("Error saving auth to localStorage:", error);
            }
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
