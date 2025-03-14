import { Types } from "mongoose";
import { ICategory } from "../../models/categoryModel";
import { ICourse } from "../../models/courseModel";
import { ITopic, ITopics } from "../../models/topicModel";
import { IWishlist } from "../../models/wishlistModel";
import { IEnrolledCourse, IEnrolledCourses } from "../../models/enrolledCoursesModel";

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
    deleteCourseById(courseId: string): Promise<void>;
    changeCourseStatus(courseId: string, status: string): Promise<void>;

    createTopic(topics: {course_id: Types.ObjectId, topics: ITopic[]}): Promise<ITopics>;
    getTopics(course_id: string): Promise<ITopics | null>;
    getTopicById(id: string): Promise<ITopics>;
    deleteTopicsByCourseId(courseId: string): Promise<void>;

    getEnrolledCoursesByUserId(userId: Types.ObjectId): Promise<IEnrolledCourses | null>;
    createEnrolledCourse(userId: Types.ObjectId,course: IEnrolledCourse): Promise<void>;

    getWishlistByUserId(userId: string): Promise<IWishlist | null>;
    createWishlist(wishlistData: { userId: Types.ObjectId; items: Types.ObjectId[] }): Promise<IWishlist>;
}