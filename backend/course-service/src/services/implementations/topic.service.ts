import { inject } from "inversify";
import { injectable } from "inversify";
import { ITopicRepository } from "@/repositories/interfaces/ITopic.repository";
import { ITopic, ITopics } from "@/models/topic.model";
import { convertToObjectId } from "@/utils/convert-objectid.util";
import getSecureVideoUrl, { deleteFromCloudinary, extractCloudinaryDetails, extractCloudinaryPublicId } from "@/utils/cloudinary.util";
import { createHttpError } from "@/utils/http-error.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateToken, verifyToken } from "@/utils/jwt.util";
import { ITopicService } from "../interfaces/ITopic.service";
@injectable()
export class TopicService implements ITopicService {
    constructor(@inject("ITopicRepository") private _topicRepository: ITopicRepository) { }

    async createTopic(topics: ITopics): Promise<ITopics | null> {

        let existTopic = await this._topicRepository.findOne({course_id: topics.course_id as string});

        let newTopics;
        if (existTopic) {
            existTopic.topics.push(...topics?.topics);
            newTopics = await this._topicRepository.save(existTopic);
        } else {
            const objectIdCourseId = convertToObjectId(topics.course_id as string);
            newTopics = await this._topicRepository.create({ course_id: objectIdCourseId, topics: topics.topics })
        }

        return newTopics;
    }

    async getTopics(course_id: string): Promise<Partial<ITopics> | null> {

        const topics = await this._topicRepository.findOne({ course_id });

        if (!topics) return null;

        const transformedTopics = await Promise.all(
            topics.topics.map(async (topic) => {
                return {
                    title: topic.title,
                    level: topic.level,
                    video_url: extractCloudinaryPublicId(topic.video_url),
                    notes_url: topic.notes_url ? extractCloudinaryPublicId(topic.notes_url) : "",
                    _id: topic?._id,
                };
            })
        );

        return {
            _id: topics._id,
            course_id: topics.course_id,
            topics: transformedTopics,
        };
    }

    async getTopicById(topicsId: string, topicId: string): Promise<ITopic | null> {

        const topics = await this._topicRepository.findById(topicsId);

        if (!topics) return null;
        
        const topic = topics.topics.find((t: any) => t._id.toString() === topicId);

        if (!topic) return null;

        return {
            _id: topic._id,
            title: topic.title,
            level: topic.level,
            video_url: extractCloudinaryPublicId(topic.video_url),
            notes_url: topic.notes_url ? topic.notes_url : "",
        };
    }

    async updateTopic(topicsId: string, topicId: string, topicData: ITopic): Promise<ITopic> {

        const topics = await this._topicRepository.findById(topicsId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        const topicIndex = topics.topics.findIndex((t: any) => t._id.toString() === topicId);

        if (topicIndex === -1) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_NOT_FOUND);
        }

        const topic = topics.topics[topicIndex];

        if (topicData.video_url && topicData.video_url !== topic.video_url) {
            if (topic.video_url) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(topic.video_url);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }
                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }
        }

        if (topicData.notes_url && topicData.notes_url !== topic.notes_url) {
            if (topic.notes_url) {
                const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(topic.notes_url);
                if (!publicId) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PUBLIC_ID_NOT_FOUND);
                }
                await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
            }
        }

        topics.topics[topicIndex] = {
            ...topic,
            title: topicData.title || topic.title,
            level: topicData.level || topic.level,
            video_url: topicData.video_url || topic.video_url,
            notes_url: topicData.notes_url || topic.notes_url
        };

        await this._topicRepository.save(topics);

        return topics.topics[topicIndex];
    }

    async deleteTopic(topicsId: string, topicId: string): Promise<void> {

        const topics = await this._topicRepository.findById(topicsId);

        if (!topics) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPICS_NOT_FOUND);
        }

        const topicIndex = topics.topics.findIndex((t: any) => t._id.toString() === topicId);

        if (topicIndex === -1) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOPIC_NOT_FOUND);
        }

        const topic = topics.topics[topicIndex];

        const mediaUrls: string[] = [];
        if (topic.video_url) mediaUrls.push(topic.video_url);
        if (topic.notes_url) mediaUrls.push(topic.notes_url);

        if (mediaUrls.length > 0) {
            await Promise.all(
                mediaUrls.map(async (url) => {
                    const { publicId, resourceType, isAuthenticated } = extractCloudinaryDetails(url);
                    if (!publicId) return;

                    await deleteFromCloudinary(publicId, resourceType, isAuthenticated);
                })
            );
        }

        topics.topics.splice(topicIndex, 1);

        await this._topicRepository.save(topics);
    }

    async getVideoToken(publicId: string): Promise<string> {

        const token = generateToken({ publicId });

        return token;
    }


    async getSecureVideo(token: string): Promise<string> {

        const decoded = verifyToken(token) as { publicId: string };

        if (!decoded || !decoded.publicId) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);
        }
        const publicId = decoded.publicId;

        if (!publicId) {
            throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);
        }

        const secureUrl = await getSecureVideoUrl(publicId);

        return secureUrl;
    }
}