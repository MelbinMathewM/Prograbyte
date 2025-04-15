export const socketConfig = {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
};

export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    JOIN_ROOM: "join_room",
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
};
  
  