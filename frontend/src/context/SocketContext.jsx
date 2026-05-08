import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        // Only connect socket if authenticated (optional, but good practice if it's a private dashboard)
        // If the socket isn't authenticated by default, it's fine
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Initialize socket
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const newSocket = io(backendUrl, {
            transports: ['websocket', 'polling'],
            withCredentials: true
            // You can pass auth token if needed
            // auth: { token }
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
