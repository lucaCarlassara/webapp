import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [username, setUsername] = useState("");

    const login = (token, username) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        setUsername(username);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUsername("");
    };

    useEffect(() => {
        // Controllo continuo per verificare se il nome utente è vuoto
        if (isAuthenticated && !username) {
            console.warn("Nome utente vuoto. Effettuando il logout...");
            logout();
        }
    }, [isAuthenticated, username]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
}
