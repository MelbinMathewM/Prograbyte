import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@/configs/socket.config";
import { ISocketService } from "../interfaces/ISocket.service";
import { inject, injectable } from "inversify";
import { ISocketRepository } from "@/repositories/interfaces/ISocket.repository";

@injectable()
export class SocketService implements ISocketService {
  private _io: Server;
  private _socketRepo: ISocketRepository;

  constructor(
    @inject("SocketIO") _io: Server,
    @inject("ISocketRepository") _socketRepo: ISocketRepository
  ) {
    this._io = _io;
    this._socketRepo = _socketRepo;
  }

  public init(): void {
    this._io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
      console.log("User connected:", socket.id);

      // User joins their personal room
      socket.on(SOCKET_EVENTS.JOIN_ROOM, (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      });

      // Handling sending messages
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ conversation, sender, receiver, content }) => {
        console.log(conversation, sender, receiver, content,'jjh');
        try {
          const message = await this._socketRepo.createMessage({
            conversation: conversation,
            sender,
            receiver,
            content,
          });

          this._io.to(receiver).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, {
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
