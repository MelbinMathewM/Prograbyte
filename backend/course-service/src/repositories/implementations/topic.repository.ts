import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import Topic, { ITopics } from "../../models/topic.model";

@injectable()
export class TopicRepository extends BaseRepository<ITopics> {
    constructor() {
        super(Topic);
    }
}
