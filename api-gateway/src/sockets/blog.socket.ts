import { Server } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

export class BlogGateway {
  private io: Server;
  private blogSocket: ClientSocket;

  constructor(io: Server) {
    this.io = io;
    this.blogSocket = ClientIO(process.env.BLOG_SERVICE || "http://localhost:5009", {
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
      this.io.emit("receive_message", data);
    });

    this.blogSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Blog Service");
    });
  }

  public initialize() {
    this.io.on("connection", (clientSocket) => {
      console.log("🌐 Frontend connected:", clientSocket.id);

      // Handle join event
      clientSocket.on("join", (userId: string) => {
        console.log(`Forwarding join event for user: ${userId}`);
        this.blogSocket.emit("join", userId);
      });

      // Forward message sending
      clientSocket.on("send_message", (data) => {
        console.log("Forwarding message to Blog Service:", data);
        this.blogSocket.emit("send_message", data);
      });

      clientSocket.on("disconnect", () => {
        console.log("🌐 Frontend disconnected:", clientSocket.id);
      });
    });
  }
}
