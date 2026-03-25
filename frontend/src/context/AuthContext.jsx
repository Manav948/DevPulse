import React, { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null
    });
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user))
        setUser(userData.user);
        setToken(userData.token);
    }

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
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
        }
    }, [token])
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
