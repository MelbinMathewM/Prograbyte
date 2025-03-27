import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { ITopics, Topic } from "../../models/topic.model";

@injectable()
export class TopicRepository extends BaseRepository<ITopics> {
    constructor() {
        super(Topic);
    }

    async getTopicsByCourseId(course_id: string): Promise<ITopics | null> {
        try {
            return await this.model.findOne({ course_id });
        } catch (error) {
            console.error("Error fetching topics by course ID:", error);
            throw new Error("Failed to fetch topics");
        }
    }

    async deleteTopicsByCourseId(course_id: string): Promise<void> {
        try {
            await this.model.findOneAndDelete({ course_id });
        } catch (error) {
            console.error("Error deleting topics by course ID:", error);
            throw new Error("Failed to delete topics");
        }
    }
}
