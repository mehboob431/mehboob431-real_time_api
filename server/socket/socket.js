import { Server } from "socket.io";


export const socketInit = (server) => {
const io = new Server(server, { cors: { origin: "*" } });


io.on("connection", socket => {
console.log("Socket Connected", socket.id);
});


return io;
};