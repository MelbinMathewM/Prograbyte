import { ITopics, ITopic } from "@/models/topicModel";

export interface ITopicService {
  createTopic(topics: ITopics): Promise<ITopics | null>;
  getTopics(course_id: string): Promise<Partial<ITopics> | null>;
  getTopicById(topicsId: string, topicId: string): Promise<ITopic | null>;
  updateTopic(topicsId: string, topicId: string, topicData: ITopic): Promise<ITopic>;
  deleteTopic(topicsId: string, topicId: string): Promise<void>;
  getVideoToken(publicId: string): Promise<string>;
  getSecureVideo(token: string): Promise<string>;
}
