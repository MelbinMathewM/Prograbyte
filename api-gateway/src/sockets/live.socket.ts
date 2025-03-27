import { Server } from "socket.io";
import { io as ClientIO, Socket as ClientSocket } from "socket.io-client";

export class LiveGateway {
  private io: Server;
  private courseSocket: ClientSocket;

  constructor(io: Server) {
    this.io = io;
    this.courseSocket = ClientIO(process.env.COURSE_SERVICE || "http://localhost:5006", {
      transports: ["websocket"],
      reconnection: true,
    });

    this.setupCourseServiceListeners();
  }

  private setupCourseServiceListeners() {
    this.courseSocket.on("connect", () => {
      console.log("✅ Connected to Course Service via WebSocket");
    });

    this.courseSocket.on("offer", (data) => {
      console.log("📡 Offer from Course Service:", data);
      this.io.emit("offer", data);
    });

    this.courseSocket.on("answer", (data) => {
      console.log("✅ Answer from Course Service:", data);
      this.io.emit("answer", data);
    });

    this.courseSocket.on("ice-candidate", (data) => {
      console.log("🔗 ICE Candidate from Course Service:", data);
      this.io.emit("ice-candidate", data);
    });

    this.courseSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Course Service");
    });
  }

  public initialize() {
    this.io.on("connection", (clientSocket) => {
      console.log("🌍 Frontend connected to Live Streaming:", clientSocket.id);

      clientSocket.on("join-room", (roomId) => {
        console.log(`User joined live session: ${roomId}`);
        this.courseSocket.emit("join-room", roomId);
      });

      clientSocket.on("offer", (data) => {
        console.log("📡 Forwarding Offer to Course Service:", data);
        this.courseSocket.emit("offer", data);
      });

      clientSocket.on("answer", (data) => {
        console.log("✅ Forwarding Answer to Course Service:", data);
        this.courseSocket.emit("answer", data);
      });

      clientSocket.on("ice-candidate", (data) => {
        console.log("🔗 Forwarding ICE Candidate to Course Service:", data);
        this.courseSocket.emit("ice-candidate", data);
      });

      clientSocket.on("disconnect", () => {
        console.log("🌍 Frontend disconnected from Live Streaming:", clientSocket.id);
      });
    });
  }
}
