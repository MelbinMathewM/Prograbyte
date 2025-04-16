import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { ITopics, Topic } from "../../models/topic.model";

@injectable()
export class TopicRepository extends BaseRepository<ITopics> {
    constructor() {
        super(Topic);
    }
}
