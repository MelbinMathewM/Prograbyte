import { ITopics } from "../../models/topic.model";
import { IBaseRepository } from "../IBase.repository";

export interface ITopicRepository extends IBaseRepository<ITopics> {
    getTopicsByCourseId(course_id: string): Promise<ITopics | null>;
    deleteTopicsByCourseId(course_id: string): Promise<void>;
}
