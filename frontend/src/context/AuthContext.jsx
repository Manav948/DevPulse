import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null
    });
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        setToken(userData.token);

        if (userData.user) {
            setUser(userData.user);
            localStorage.setItem("user", JSON.stringify(userData.user));
        } else {
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null);
        setToken(null);
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    useEffect(() => {
        const syncUser = async () => {
            if (!token) return;
            try {
                const res = await api.get("/api/v1/users/me");
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch (error) {
                console.log("Failed to sync user", error);
            }
        };

        syncUser();
    }, [token]);
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
