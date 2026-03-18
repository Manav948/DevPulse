import React, { createContext, useContext, useEffect, useState } from 'react'


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        setUser(userData.user);
        setToken(userData.token);
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null);
        setToken(null);
    }
    useEffect(() => {
        if (token) {
            console.log("Token")
        }
    }, [token])
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
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
