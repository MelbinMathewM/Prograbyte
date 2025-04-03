import { Router } from "express";
import container from "@/configs/inversify.config";
import { EnrolledCourseController } from "@/controllers/implementations/enrolled-course.controller";

const enrolledCourseRouter = Router();
const enrolledCourseController = container.get<EnrolledCourseController>(EnrolledCourseController);

// Enrolled course routes
enrolledCourseRouter.post("/", enrolledCourseController.enrollCourse.bind(enrolledCourseController));
enrolledCourseRouter.get("/:userId", enrolledCourseController.getEnrollCourses.bind(enrolledCourseController));
enrolledCourseRouter.post("/:userId/update-progress", enrolledCourseController.updateTopicProgress.bind(enrolledCourseController));

export default enrolledCourseRouter;
