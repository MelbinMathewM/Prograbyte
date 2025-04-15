import { SOCKET_EVENTS } from "@/configs/socket.config";
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
    this.blogSocket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.log("Connected to Blog Service via WebSocket");
    });

    this.blogSocket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log("Message from Blog Service:", data);
      this.nsp.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, data);
    });

    this.blogSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log("Disconnected from Blog Service");
    });
  }

  public initialize() {
    this.nsp.on(SOCKET_EVENTS.CONNECTION, (clientSocket) => {
      console.log("Frontend connected to Blog Namespace:", clientSocket.id);

      clientSocket.on(SOCKET_EVENTS.JOIN_ROOM, (userId: string) => {
        console.log(`Forwarding join event for user: ${userId}`);
        this.blogSocket.emit(SOCKET_EVENTS.JOIN_ROOM, userId);
      });

      clientSocket.on(SOCKET_EVENTS.SEND_MESSAGE, (data: any) => {
        console.log("✉️ Forwarding message to Blog Service:", data);
        this.blogSocket.emit(SOCKET_EVENTS.SEND_MESSAGE, data);
      });

      clientSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("🌐 Frontend disconnected from Blog Namespace:", clientSocket.id);
      });
    });
  }
}
