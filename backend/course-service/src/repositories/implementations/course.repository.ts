import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { Course, ICourse } from "../../models/course.model";

@injectable()
export class CourseRepository extends BaseRepository<ICourse> {
    constructor() {
        super(Course);
    }

    async getCoursesByTutorId(tutor_id: string): Promise<ICourse[]> {
        try {
            return await this.model.find({ tutor_id });
        } catch (error) {
            console.error("Error fetching courses by tutor ID:", error);
            throw new Error("Failed to fetch tutor courses");
        }
    }

    async getCoursesByCategoryId(category_id: string): Promise<ICourse[]> {
        try {
            return await this.model.find({ category_id });
        } catch (error) {
            console.error("Error fetching courses by category ID:", error);
            throw new Error("Failed to fetch category courses");
        }
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        try {
            await this.model.findByIdAndUpdate(courseId, { approval_status: status });
        } catch (error) {
            console.error("Error changing course status:", error);
            throw new Error("Failed to change course status");
        }
    }

    async getCourseDetail(id: string): Promise<ICourse | null> {
        try {
            return await this.model.findById(id).populate('category_id', 'name').lean();
        } catch (error) {
            console.error("Error fetching course detail:", error);
            throw new Error("Failed to fetch course detail");
        }
    }
}
