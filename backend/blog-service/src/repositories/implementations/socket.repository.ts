import { BaseRepository } from "@/repositories/base.repository";
import { Message, IMessage } from "@/models/message.model";
import { ISocketRepository } from "@/repositories/interfaces/ISocket.repository";
import { injectable } from "inversify";

@injectable()
export class SocketRepository extends BaseRepository<IMessage> implements ISocketRepository {
  constructor() {
    super(Message);
  }

  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    return this.create(data);
  }

  async getConversationMessages(conversationId: string): Promise<IMessage[]> {
    return this.find({ conversation: conversationId });
  }
}
