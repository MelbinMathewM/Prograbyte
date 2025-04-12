import { Namespace, Server } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

export class BlogGateway {
  private io: Server;
  private blogSocket: ClientSocket;
  private nsp: Namespace;

  constructor(io: Server) {
    this.io = io;
    this.nsp = io.of("/blog");
    this.blogSocket = ClientIO(process.env.BLOG_SERVICE || "http://localhost:5004", {
      transports: ["websocket"],
      reconnection: true,
    });

    this.setupBlogServiceListeners();
  }

  private setupBlogServiceListeners() {
    this.blogSocket.on("connect", () => {
      console.log("✅ Connected to Blog Service via WebSocket");
    });

    this.blogSocket.on("receive_message", (data) => {
      console.log("📨 Message from Blog Service:", data);
      this.nsp.emit("receive_message", data);
    });

    this.blogSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Blog Service");
    });
  }

  public initialize() {
    this.nsp.on("connection", (clientSocket) => {
      console.log("🌐 Frontend connected to Blog Namespace:", clientSocket.id);

      clientSocket.on("join", (userId: string) => {
        console.log(`Forwarding join event for user: ${userId}`);
        this.blogSocket.emit("join", userId);
      });

      clientSocket.on("send_message", (data) => {
        console.log("✉️ Forwarding message to Blog Service:", data);
        this.blogSocket.emit("send_message", data);
      });

      clientSocket.on("disconnect", () => {
        console.log("🌐 Frontend disconnected from Blog Namespace:", clientSocket.id);
      });
    });
  }
}
