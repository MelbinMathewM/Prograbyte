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
    this.courseSocket.on("connect", () => {
      console.log("✅ Connected to Course Service via WebSocket");
    });

    this.courseSocket.on("receive_comment", ({ roomId, comment }) => {
      console.log("📡 comment from Course Service:", comment);
      this.nsp.to(roomId).emit("receive_comment", comment);
    });

    this.courseSocket.on("update_viewer_count", ({ roomId, count }) => {
      this.nsp.to(roomId).emit("update_viewer_count", count);
    });

    this.courseSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Course Service");
    });
  }

  public initialize() {
    this.nsp.on("connection", (clientSocket) => {
      console.log("🌍 Frontend connected to Live Streaming:", clientSocket.id);

      clientSocket.on("join_room", (roomId) => {
        console.log(`${clientSocket.id} joined live session: ${roomId}`);
        clientSocket.join(roomId);
        this.courseSocket.emit("join_room", roomId);
      });

      clientSocket.on("send_comment", (data) => {
        console.log("📡 Forwarding Comment to Course Service:", data);
        this.courseSocket.emit("send_comment", data);
      });

      clientSocket.on("disconnect", () => {
        console.log("🌍 Frontend disconnected from Live Streaming:", clientSocket.id);
      });
    });
  }
}
