import { ITopics } from "../../models/topicModel";
import { IBaseRepository } from "../IBaseRepository";

export interface ITopicRepository extends IBaseRepository<ITopics> {
    getTopicsByCourseId(course_id: string): Promise<ITopics | null>;
    deleteTopicsByCourseId(course_id: string): Promise<void>;
}
