import { SOCKET_EVENTS } from "@/configs/socket.config";
import { Namespace, Server } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

export class LiveGateway {
  private io: Server;
  private courseSocket: ClientSocket;
  private nsp: Namespace;

  constructor(io: Server) {
    this.io = io;
    this.nsp = io.of("/live");
    this.courseSocket = ClientIO(process.env.COURSE_SERVICE || "http://localhost:5003", {
      transports: ["websocket"],
      reconnection: true,
    });

    this.setupCourseServiceListeners();
  }

  private setupCourseServiceListeners() {
    this.courseSocket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.log("Connected to Course Service via WebSocket");
    });

    this.courseSocket.on(SOCKET_EVENTS.RECEIVE_COMMENT, ({ roomId, comment }) => {
      console.log("comment from Course Service:", comment);
      this.nsp.to(roomId).emit(SOCKET_EVENTS.RECEIVE_COMMENT, comment);
    });

    this.courseSocket.on(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, ({ roomId, count }) => {
      this.nsp.to(roomId).emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, count);
    });

    this.courseSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Disconnected from Course Service");
    });
  }

  public initialize() {
    this.nsp.on(SOCKET_EVENTS.CONNECTION, (clientSocket) => {
      console.log("🌍 Frontend connected to Live Streaming:", clientSocket.id);

      clientSocket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string, username: string) => {
        console.log(`${username} joined live session: ${roomId}`);
        clientSocket.join(roomId);
        this.courseSocket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId, username);
      });

      clientSocket.on(SOCKET_EVENTS.SEND_COMMENT, (data:{ roomId: string; comment: any }) => {
        console.log("Forwarding Comment to Course Service:", data);
        this.courseSocket.emit(SOCKET_EVENTS.SEND_COMMENT, data);
      });

      clientSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("Frontend disconnected from Live Streaming:", clientSocket.id);
      });
    });
  }
}
