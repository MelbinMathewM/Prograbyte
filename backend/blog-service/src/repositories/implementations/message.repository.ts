import { IMessage, Message } from "@/models/message.model";
import { injectable } from "inversify";
import { BaseRepository } from "@/repositories/base.repository";
import { IMessageRepository } from "@/repositories/interfaces/IMessage.repository";
import { FilterQuery } from "mongoose";

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
    constructor() {
        super(Message);
    }

    async findByQuery(
        filter: FilterQuery<IMessage> = {}, 
        query: any = {}
    ): Promise<IMessage[]> {
        return await Message.find(filter, null, query).lean();
    }
}