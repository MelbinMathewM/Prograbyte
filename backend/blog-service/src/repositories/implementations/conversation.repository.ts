import { Conversation, IConversation } from "@/models/conversation.model";
import { injectable } from "inversify";
import { BaseRepository } from "@/repositories/base.repository";
import { IConversationRepository } from "@/repositories/interfaces/IConversation.repository";

@injectable()
export class ConversationRepository extends BaseRepository<IConversation> implements IConversationRepository {
  constructor() {
    super(Conversation);
  }
}