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
    JOIN: "join_room",
    SEND_COMMENT: "send_comment",
    RECEIVE_COMMENT: "receive_comment",
    UPDATE_VIEWER_COUNT: "update_viewer_count",

    LIVE_JOIN: "live_join",
    LIVE_OFFER: "live_offer",
    LIVE_ANSWER: "live_answer",
    LIVE_ICE_CANDIDATE: "live_ice_candidate",
};
