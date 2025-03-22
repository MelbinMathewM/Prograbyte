import { Router } from "express";
import container from "@/di/container";
import { EnrolledCourseController } from "@/controllers/implementations/enrolledCourseController";

const enrolledCourseRouter = Router();
const enrolledCourseController = container.get<EnrolledCourseController>(EnrolledCourseController);

// Enrolled course routes
enrolledCourseRouter.post("/", enrolledCourseController.enrollCourse.bind(enrolledCourseController));
enrolledCourseRouter.get("/:userId", enrolledCourseController.getEnrollCourses.bind(enrolledCourseController));

export default enrolledCourseRouter;
