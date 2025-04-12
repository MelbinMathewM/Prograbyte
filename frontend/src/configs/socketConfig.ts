// src/utils/sockets.ts
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const liveSocket: Socket = io(`${BASE_URL}/live`, {
  transports: ["websocket"],
  reconnection: true,
});

export const blogSocket: Socket = io(`${BASE_URL}/blog`, {
  transports: ["websocket"],
  reconnection: true,
});

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  JOIN: "join_room",
  SEND_COMMENT: "send_comment",
  RECEIVE_COMMENT: "receive_comment",
  VIEW_COUNT: "update_viewer_count",
};