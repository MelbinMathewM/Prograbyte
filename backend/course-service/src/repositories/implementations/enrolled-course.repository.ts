import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import EnrolledCourses, { IEnrolledCourses, IEnrolledCourse } from "../../models/enrolled-course.model";
import { Types } from "mongoose";
import { IEnrolledCourseRepository } from "../interfaces/IEnrolled-course.repository";

@injectable()
export class EnrolledCourseRepository extends BaseRepository<IEnrolledCourses> implements IEnrolledCourseRepository {
    constructor() {
        super(EnrolledCourses);
    }

    async getEnrolledCoursesByUserId(userId: Types.ObjectId): Promise<IEnrolledCourses | null> {
        try {
            return await this.model.findOne({ userId }).populate("courses.courseId");
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
            throw new Error("Failed to fetch enrolled courses");
        }
    }

    async createEnrolledCourse(userId: Types.ObjectId, course: IEnrolledCourse): Promise<void> {
        try {
            await this.model.create({ userId, courses: [course] });
        } catch (error) {
            console.error("Error creating enrolled course:", error);
            throw new Error("Failed to create enrolled course");
        }
    }
}
