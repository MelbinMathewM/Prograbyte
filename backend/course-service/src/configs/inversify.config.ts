import "reflect-metadata";
import { Container } from "inversify";
import { Server } from "socket.io";
import { socketConfig } from "@/configs/socket.config";
import http from "http";
import express from "express";

// Controllers
import { CategoryController } from "@/controllers/implementations/category.controller";
import { CourseController } from "@/controllers/implementations/course.controller";
import { TopicController } from "@/controllers/implementations/topic.controller";
import { EnrolledCourseController } from "@/controllers/implementations/enrolled-course.controller";
import { WishlistController } from "@/controllers/implementations/wishlist.controller";
import { LiveController } from "@/controllers/implementations/live.controller";

// Services
import { CategoryService } from "@/services/implementations/category.service";
import { CourseService } from "@/services/implementations/course.service";
import { TopicService } from "@/services/implementations/topic.service";
import { EnrolledCourseService } from "@/services/implementations/enrolled-course.service";
import { WishlistService } from "@/services/implementations/wishlist.service";
import { LiveService } from "@/services/implementations/live.service";

// Repositories
import { CategoryRepository } from "@/repositories/implementations/category.repository";
import { CourseRepository } from "@/repositories/implementations/course.repository";
import { TopicRepository } from "@/repositories/implementations/topic.repository";
import { EnrolledCourseRepository } from "@/repositories/implementations/enrolled-course.repository";
import { WishlistRepository } from "@/repositories/implementations/wishlist.repository";
import { LiveRepository } from "@/repositories/implementations/live.repository";

// Interfaces
import { ICategoryRepository } from "@/repositories/interfaces/ICategory.repository";
import { ICourseRepository } from "@/repositories/interfaces/ICourse.repository";
import { ITopicRepository } from "@/repositories/interfaces/ITopic.repository";
import { IEnrolledCourseRepository } from "@/repositories/interfaces/IEnrolled-course.repository";
import { IWishlistRepository } from "@/repositories/interfaces/IWishlist.repository";
import { ILiveRepository } from "@/repositories/interfaces/ILive.repository";

// Express & Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, socketConfig);

// Create container
const container = new Container({ defaultScope: "Singleton" });

// Socket IO binding
container.bind<Server>("SocketIO").toConstantValue(io);

// Repositories Bindings
container.bind<ICategoryRepository>("ICategoryRepository").to(CategoryRepository);
container.bind<ICourseRepository>("ICourseRepository").to(CourseRepository);
container.bind<ITopicRepository>("ITopicRepository").to(TopicRepository);
container.bind<IEnrolledCourseRepository>("IEnrolledCourseRepository").to(EnrolledCourseRepository);
container.bind<IWishlistRepository>("IWishlistRepository").to(WishlistRepository);
container.bind<ILiveRepository>("ILiveRepository").to(LiveRepository);

// Services Bindings
container.bind<CategoryService>(CategoryService).toSelf();
container.bind<CourseService>(CourseService).toSelf();
container.bind<TopicService>(TopicService).toSelf();
container.bind<EnrolledCourseService>(EnrolledCourseService).toSelf();
container.bind<WishlistService>(WishlistService).toSelf();
container.bind<LiveService>(LiveService).toSelf();

// Controllers Bindings
container.bind<CategoryController>(CategoryController).toSelf();
container.bind<CourseController>(CourseController).toSelf();
container.bind<TopicController>(TopicController).toSelf();
container.bind<EnrolledCourseController>(EnrolledCourseController).toSelf();
container.bind<WishlistController>(WishlistController).toSelf();
container.bind<LiveController>(LiveController).toSelf();

export {server};

export default container;

