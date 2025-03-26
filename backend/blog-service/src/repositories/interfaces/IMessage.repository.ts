import { IMessage } from "@/models/message.model";
import { IBaseRepository } from "@/repositories/IBase.repository";
import { FilterQuery } from "mongoose";

export interface IMessageRepository extends IBaseRepository<IMessage> {
    findByQuery(filter: FilterQuery<IMessage>, query: any): Promise<IMessage[]>;
}