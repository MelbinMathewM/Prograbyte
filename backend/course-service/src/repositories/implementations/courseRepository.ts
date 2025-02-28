import {injectable} from "inversify";
import Category, { ICategory }  from "../../models/categoryModel";
import { ICourseRepository } from "../interfaces/ICourseRepository";
import { Course, ICourse } from "../../models/courseModel";
import { ITopic, Topic } from "../../models/topicModel";

@injectable()
export class CourseRepository implements ICourseRepository {
    async createCategory(category: ICategory): Promise<ICategory> {
        return await Category.create(category);
    }

    async getCategories(): Promise<ICategory[]> {
        return await Category.find();
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return await Category.findById(id);
    }

    async getCategoryByName(categoryName: string): Promise<ICategory | null> {
        return await Category.findOne({name: { $regex: new RegExp(`^${categoryName}$`, "i") }})
    }

    async getCategoryByNameAndNotId(name: string, id: string) {
        return await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, _id: { $ne: id } });
    }
    

    async updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteCategory(id: string): Promise<boolean> {
        const result = await Category.findByIdAndDelete(id);
        return result !== null;
    }
    

    async createCourse(course: ICourse): Promise<ICourse> {
        return await Course.create(course);
    }

    async createTopic(topic: ITopic[]): Promise<ITopic[]> {
        return await Topic.insertMany(topic);
    }

    async getCoursesByTutorId(tutor_id: string): Promise<ICourse[] | null> {
        return await Course.find({tutor_id: tutor_id});
    }

    async getCourses(): Promise<ICourse[] | null> {
        return await Course.find();
    }

    async getCoursesByCategoryId(categoryId: string): Promise<ICourse[] | null> {
        return await Course.find({category_id: categoryId});
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        await Course.findByIdAndUpdate(courseId,{approval_status: status});
    }

    async getCourseDetail(id: string): Promise<ICourse | null> {
        return await Course.findById(id).populate('category_id','name').lean();
    }

    async getTopics(course_id: string): Promise<ITopic[] | null> {
        return await Topic.find({course_id: course_id});
    }

    async findCourseAndUpdate(courseId: string, courseData: Object): Promise<ICourse | null> {
        return await Course.findByIdAndUpdate(courseId, courseData, { new: true });
    }
}