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

    // Forward comments from Course Service to Live Streaming namespace
    this.courseSocket.on(SOCKET_EVENTS.RECEIVE_COMMENT, ({ roomId, comment }) => {
      this.nsp.to(roomId).emit(SOCKET_EVENTS.RECEIVE_COMMENT, comment);
    });

    // Forward viewer count updates from Course Service
    this.courseSocket.on(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, ({ roomId, count }) => {
      this.nsp.to(roomId).emit(SOCKET_EVENTS.UPDATE_VIEWER_COUNT, count);
    });

    // Forward disconnect event from Course Service
    this.courseSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Disconnected from Course Service");
    });
  }

  public initialize() {
    this.nsp.on(SOCKET_EVENTS.CONNECTION, (clientSocket) => {
      console.log("🌍 Frontend connected to Live Streaming:", clientSocket.id);

      // Forward JOIN_ROOM event to Course Service
      clientSocket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string, username: string) => {
        clientSocket.join(roomId);
        this.courseSocket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId, username);
      });

      // Forward SEND_COMMENT event to Course Service
      clientSocket.on(SOCKET_EVENTS.SEND_COMMENT, (data: { roomId: string; comment: any }) => {
        this.courseSocket.emit(SOCKET_EVENTS.SEND_COMMENT, data);
      });

      // Forward END_STREAM event to Course Service
      clientSocket.on(SOCKET_EVENTS.END_STREAM, (roomId: string) => {
        this.courseSocket.emit(SOCKET_EVENTS.END_STREAM, roomId);
      });

      // Forward LEAVE event to Course Service
      clientSocket.on(SOCKET_EVENTS.LEAVE, (roomId: string) => {
        this.courseSocket.emit(SOCKET_EVENTS.LEAVE, roomId);
      });

      // Handle disconnect from frontend (no need to do anything extra here)
      clientSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("Frontend disconnected from Live Streaming:", clientSocket.id);
      });
    });
  }
}
