import { Router } from "express";
import container from "@/di/container";
import { CourseController } from "../controllers/implementations/courseController";
import { attachFilesToCourse } from "@/middlewares/attachFiles";
import { validate } from "@/middlewares/validateMiddleware";
import { courseSchema } from "@/schemas/addCourseSchema";
import { editCourseSchema } from "@/schemas/editCourseSchema";
import { uploadCourse } from "@/config/multer";

const courseRouter = Router();
const courseController = container.get<CourseController>(CourseController);

// Course routes
courseRouter.post("/", uploadCourse,attachFilesToCourse,validate(courseSchema), courseController.createCourse.bind(courseController));
courseRouter.patch("/:courseId/status", courseController.changeCourseApprovalStatus.bind(courseController));
courseRouter.get("/", courseController.getCourses.bind(courseController));
courseRouter.get("/:id", courseController.getCourseDetail.bind(courseController));
courseRouter.put("/:courseId",uploadCourse,attachFilesToCourse,validate(editCourseSchema), courseController.editCourse.bind(courseController));
courseRouter.delete("/:courseId", courseController.deleteCourse.bind(courseController));
courseRouter.post("/payment/create", courseController.createPayment.bind(courseController));

export default courseRouter;