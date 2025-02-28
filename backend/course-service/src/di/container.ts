import "reflect-metadata";
import { Container } from "inversify";
import { CourseController } from "../controllers/courseController";
import { CourseService } from "../services/courseService";
import { CourseRepository } from "../repositories/implementations/courseRepository";
import { ICourseRepository } from "../repositories/interfaces/ICourseRepository";

const container = new Container({defaultScope: "Singleton"});

container.bind<ICourseRepository>("ICourseRepository").to(CourseRepository);
container.bind<CourseService>(CourseService).toSelf();
container.bind<CourseController>(CourseController).toSelf();

export default container;