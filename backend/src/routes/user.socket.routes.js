import verifyJWTUser from '../middleware/authUser.socket.middleware.js';
import { 
    connection,
    makeMove,
    onDisconnect,

 } from '../controller/user.socket.controller.js';

const socketHandler = (io) => {
    io.use(verifyJWTUser);
    
    io.on('connection', (socket) => {
        
        connection(io, socket);

        makeMove(io, socket);

        onDisconnect(io, socket);
    });
};

export default socketHandler;