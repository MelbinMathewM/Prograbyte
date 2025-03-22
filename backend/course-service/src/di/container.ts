import "reflect-metadata";
import { Container } from "inversify";

// Controllers
import { CategoryController } from "@/controllers/implementations/categoryController";
import { CourseController } from "@/controllers/implementations/courseController";
import { TopicController } from "@/controllers/implementations/topicController";
import { EnrolledCourseController } from "@/controllers/implementations/enrolledCourseController";
import { WishlistController } from "@/controllers/implementations/wishlistController";

// Services
import { CategoryService } from "@/services/implementations/categoryService";
import { CourseService } from "@/services/implementations/courseService";
import { TopicService } from "@/services/implementations/topicService";
import { EnrolledCourseService } from "@/services/implementations/enrolledCourseService";
import { WishlistService } from "@/services/implementations/wishlistService";

// Repositories
import { CategoryRepository } from "@/repositories/implementations/categoryRepository";
import { CourseRepository } from "@/repositories/implementations/courseRepository";
import { TopicRepository } from "@/repositories/implementations/topicRepository";
import { EnrolledCourseRepository } from "@/repositories/implementations/enrolledCourseRepository";
import { WishlistRepository } from "@/repositories/implementations/wishlistRepository";

// Interfaces
import { ICategoryRepository } from "@/repositories/interfaces/ICategoryRepository";
import { ICourseRepository } from "@/repositories/interfaces/ICourseRepository";
import { ITopicRepository } from "@/repositories/interfaces/ITopicRepository";
import { IEnrolledCourseRepository } from "@/repositories/interfaces/IEnrolledCourseRepository";
import { IWishlistRepository } from "@/repositories/interfaces/IWishlistRepository";

// Create container
const container = new Container({ defaultScope: "Singleton" });

// Repositories Bindings
container.bind<ICategoryRepository>("ICategoryRepository").to(CategoryRepository);
container.bind<ICourseRepository>("ICourseRepository").to(CourseRepository);
container.bind<ITopicRepository>("ITopicRepository").to(TopicRepository);
container.bind<IEnrolledCourseRepository>("IEnrolledCourseRepository").to(EnrolledCourseRepository);
container.bind<IWishlistRepository>("IWishlistRepository").to(WishlistRepository);

// Services Bindings
container.bind<CategoryService>(CategoryService).toSelf();
container.bind<CourseService>(CourseService).toSelf();
container.bind<TopicService>(TopicService).toSelf();
container.bind<EnrolledCourseService>(EnrolledCourseService).toSelf();
container.bind<WishlistService>(WishlistService).toSelf();

// Controllers Bindings
container.bind<CategoryController>(CategoryController).toSelf();
container.bind<CourseController>(CourseController).toSelf();
container.bind<TopicController>(TopicController).toSelf();
container.bind<EnrolledCourseController>(EnrolledCourseController).toSelf();
container.bind<WishlistController>(WishlistController).toSelf();

export default container;
