import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@/configs/socket.config";
import { ISocketService } from "../interfaces/ISocket.service";
import { inject, injectable } from "inversify";
import { ISocketRepository } from "@/repositories/interfaces/ISocket.repository";

@injectable()
export class SocketService implements ISocketService {
  private io: Server;
  private socketRepo: ISocketRepository;

  constructor(
    @inject("SocketIO") io: Server,
    @inject("ISocketRepository") socketRepo: ISocketRepository
  ) {
    this.io = io;
    this.socketRepo = socketRepo;
  }

  public init(): void {
    this.io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
      console.log("User connected:", socket.id);

      // User joins their personal room
      socket.on(SOCKET_EVENTS.JOIN, (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      // Handling sending messages
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ conversation, sender, receiver, content }) => {
        console.log(conversation, sender, receiver, content,'jjh');
        try {
          const message = await this.socketRepo.createMessage({
            conversation: conversation,
            sender,
            receiver,
            content,
          });

          this.io.to(receiver).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
            conversation,
            sender,
            content,
            createdAt: message?.createdAt,
          });
        } catch (err) {
          console.error("Error saving message:", err);
        }
      });

      // Handle disconnect
      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
}
