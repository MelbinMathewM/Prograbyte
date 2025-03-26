import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const socket = io(BASE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
