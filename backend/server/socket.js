import {Server} from 'socket.io';

let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors : {
            origin : ['http://localhost:5173', 'https://devpulse.manavvalani.in'],
            methods : ['GET', 'POST']
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
