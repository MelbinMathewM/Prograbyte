import { IMessage } from "@/models/message.model";

export interface ISocketRepository {
    createMessage(data: Partial<IMessage>): Promise<IMessage>;
    getConversationMessages(conversationId: string): Promise<IMessage[]>;
}