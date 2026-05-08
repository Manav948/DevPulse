import {Server} from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

let io;
export const initSocket = (server) => {
    const defaultOrigins = ["http://localhost:5173", "https://devpulse.manavvalani.in"];
    const frontendOrigin = process.env.FRONTEND_URL?.replace(/\/$/, "");
    const allowedOrigins = frontendOrigin ? [...new Set([...defaultOrigins, frontendOrigin])] : defaultOrigins;

    io = new Server(server, {
        cors : {
            origin : allowedOrigins,
            methods : ['GET', 'POST', 'OPTIONS'],
            credentials: true
        }
    })
    io.on('connection', (socket) => {
        console.log('User Connected with id : ' + socket.id);

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })
    return io;
}

export const getIO = () => {
    if(!io){
        throw new Error('Socket.io not initialized');
    }
    return io;
}
