import { injectable } from "inversify";
import Category, { ICategory } from "../../models/categoryModel";
import { ICourseRepository } from "../interfaces/ICourseRepository";
import { Course, ICourse } from "../../models/courseModel";
import { ITopic, ITopics, Topic } from "../../models/topicModel";
import Wishlist, { IWishlist } from "../../models/wishlistModel";
import mongoose, { Types } from "mongoose";
import EnrolledCourses, { IEnrolledCourse, IEnrolledCourses } from "../../models/enrolledCoursesModel";

@injectable()
export class CourseRepository implements ICourseRepository {
    async createCategory(category: ICategory): Promise<ICategory> {
        try {
            return await Category.create(category);
        } catch (error) {
            console.error("Error creating category:", error);
            throw new Error("Failed to create category");
        }
    }

    async getCategories(): Promise<ICategory[]> {
        try {
            return await Category.find();
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw new Error("Failed to retrieve categories");
        }
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        try {
            return await Category.findById(id);
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw new Error("Failed to retrieve category");
        }
    }

    async getCategoryByName(categoryName: string): Promise<ICategory | null> {
        try {
            return await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });
        } catch (error) {
            console.error("Error fetching category by name:", error);
            throw new Error("Failed to retrieve category");
        }
    }

    async getCategoryByNameAndNotId(name: string, id: string) {
        try {
            return await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, _id: { $ne: id } });
        } catch (error) {
            console.error("Error fetching category by name and ID:", error);
            throw new Error("Failed to retrieve category");
        }
    }

    async updateCategory(id: string, updatedData: Partial<ICategory>): Promise<ICategory | null> {
        try {
            return await Category.findByIdAndUpdate(id, updatedData, { new: true });
        } catch (error) {
            console.error("Error updating category:", error);
            throw new Error("Failed to update category");
        }
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const result = await Category.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw new Error("Failed to delete category");
        }
    }

    async createCourse(course: ICourse): Promise<ICourse> {
        try {
            return await Course.create(course);
        } catch (error) {
            console.error("Error creating course:", error);
            throw new Error("Failed to create course");
        }
    }

    async createTopic(topics: {course_id: mongoose.Types.ObjectId, topics: ITopic[]}): Promise<ITopics> {
        try {
            return await Topic.create(topics);
        } catch (error) {
            console.error("Error creating topics:", error);
            throw new Error("Failed to create topics");
        }
    }

    async getCoursesByTutorId(tutor_id: string): Promise<ICourse[] | null> {
        try {
            return await Course.find({ tutor_id });
        } catch (error) {
            console.error("Error fetching courses by tutor ID:", error);
            throw new Error("Failed to retrieve courses");
        }
    }

    async getCourses(): Promise<ICourse[] | null> {
        try {
            return await Course.find();
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw new Error("Failed to retrieve courses");
        }
    }

    async getCoursesByCategoryId(categoryId: string): Promise<ICourse[] | null> {
        try {
            return await Course.find({ category_id: categoryId });
        } catch (error) {
            console.error("Error fetching courses by category ID:", error);
            throw new Error("Failed to retrieve courses");
        }
    }

    async changeCourseStatus(courseId: string, status: string): Promise<void> {
        try {
            await Course.findByIdAndUpdate(courseId, { approval_status: status });
        } catch (error) {
            console.error("Error updating course status:", error);
            throw new Error("Failed to update course status");
        }
    }

    async getCourseDetail(id: string): Promise<ICourse | null> {
        try {
            return await Course.findById(id).populate('category_id', 'name').lean();
        } catch (error) {
            console.error("Error fetching course details:", error);
            throw new Error("Failed to retrieve course details");
        }
    }

    async getEnrolledCoursesByUserId(userId: Types.ObjectId): Promise<IEnrolledCourses | null> {
        try{
            return await EnrolledCourses.findOne({userId}).populate("courses.courseId");
        }catch(error) {
            console.error("Error fetching enrolled courses");
            throw new Error("Failed to fetch enrolled courses")
        }
    }

    async createEnrolledCourse(userId: Types.ObjectId, course: IEnrolledCourse): Promise<void> {
        try{
            await EnrolledCourses.create({
                userId,
                courses: [course]
            })
        }catch(error) {
            console.error("Error creating enrolled courses");
            throw new Error("Failed to create enrolled courses");
        }
    }

    async getTopics(course_id: string): Promise<ITopics | null> {
        try {
            return await Topic.findOne({ course_id });
        } catch (error) {
            console.error("Error fetching topics:", error);
            throw new Error("Failed to retrieve topics");
        }
    }

    async getTopicById(id: string): Promise<ITopics> {
        try {
            const topic = await Topic.findById(id);
            if (!topic) {
                throw new Error("Topic not found");
            }
            return topic;
        } catch (error) {
            console.error("Error fetching topic:", error);
            throw new Error("Failed to retrieve topic");
        }
    }

    async findCourseAndUpdate(courseId: string, courseData: Object): Promise<ICourse | null> {
        try {
            return await Course.findByIdAndUpdate(courseId, courseData, { new: true });
        } catch (error) {
            console.error("Error updating course:", error);
            throw new Error("Failed to update course");
        }
    }

    async getWishlistByUserId(userId: string): Promise<IWishlist | null> {
        try {
            return await Wishlist.findOne({ userId }).populate({
                path: "items",
                select: "title price poster_url",
            });
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            throw new Error("Failed to fetch wishlist");
        }
    }

    async createWishlist(wishlistData: { userId: Types.ObjectId; items: Types.ObjectId[] }): Promise<IWishlist> {
        try{
            return await Wishlist.create(wishlistData);
        }catch(err){
            console.error("Error creating wishlist");
            throw new Error("Failed to create wishlist")
        }
    }
}
