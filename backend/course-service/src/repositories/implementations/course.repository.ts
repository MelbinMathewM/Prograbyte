import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { Course, ICourse } from "../../models/course.model";

@injectable()
export class CourseRepository extends BaseRepository<ICourse> {
    constructor() {
        super(Course);
    }

    async getFilteredCourses(filters: object, sort: string): Promise<ICourse[]> {
        try {
            let query = Course.find(filters);
    
            switch (sort) {
                case "price-low":
                    query = query.sort({ price: 1 });
                    break;
                case "price-high":
                    query = query.sort({ price: -1 });
                    break;
                case "newest":
                    query = query.sort({ createdAt: -1 });
                    break;
                case "oldest":
                    query = query.sort({ createdAt: 1 });
                    break;
                case "popularity":
                    query = query.sort({ enrollments: -1 });
                    break;
                case "rating-high":
                    query = query.sort({ rating: -1 });
                    break;
                case "rating-low":
                    query = query.sort({ rating: 1 });
                    break;
                default:
                    break;
            }
    
            return await query;
        } catch (error) {
            console.error("Error fetching filtered courses:", error);
            throw new Error("Failed to fetch filtered courses");
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
