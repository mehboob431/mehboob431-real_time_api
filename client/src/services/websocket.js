let socket;

export const connectSocket = () => {
    socket = new WebSocket("ws://localhost:5000");
};

export const getSocket = () => socket;
