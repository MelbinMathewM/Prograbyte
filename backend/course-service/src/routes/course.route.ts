import { Router } from "express";
import container from "@/configs/inversify.config";
import { CourseController } from "../controllers/implementations/course.controller";
import { attachFilesToCourse } from "@/middlewares/attach-files.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { courseSchema } from "@/schemas/add-course.schema";
import { editCourseSchema } from "@/schemas/edit-course.schema";
import { uploadCourse } from "@/configs/multer.config";

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
courseRouter.post("/rating", courseController.addRating.bind(courseController));
courseRouter.get("/rating/:courseId", courseController.getRatings.bind(courseController));

export default courseRouter;