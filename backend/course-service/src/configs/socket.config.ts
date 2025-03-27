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
    JOIN: "join",
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",

    LIVE_JOIN: "live_join",
    LIVE_OFFER: "live_offer",
    LIVE_ANSWER: "live_answer",
    LIVE_ICE_CANDIDATE: "live_ice_candidate",
};
