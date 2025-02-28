import { ICategory } from "../../models/categoryModel";
import { ICourse } from "../../models/courseModel";
import { ITopic } from "../../models/topicModel";

export interface ICourseRepository {

    createCategory(category: ICategory): Promise<ICategory>;
    getCategories(): Promise<ICategory[]>;
    getCategoryById(id: string): Promise<ICategory | null>;
    getCategoryByName(categoryName: string): Promise<ICategory | null>;
    getCategoryByNameAndNotId(name: string, id: string): Promise<ICategory | null>;
    updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<boolean>;

    createCourse(course: ICourse): Promise<ICourse>;
    getCoursesByTutorId(tutor_id: string): Promise<ICourse[] | null>;
    getCourses(): Promise<ICourse[] | null>;
    getCoursesByCategoryId(categoryId: string): Promise<ICourse[] | null>;
    getCourseDetail(id: string): Promise<ICourse | null>;
    findCourseAndUpdate(courseId: string, courseData: Object): Promise<ICourse | null>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;

    createTopic(topic: ITopic[]): Promise<ITopic[]>;
    getTopics(course_id: string): Promise<ITopic[] | null>;
}