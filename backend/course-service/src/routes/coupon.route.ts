import container from "@/configs/inversify.config";
import { CourseController } from "@/controllers/implementations/course.controller";
import { ICourseController } from "@/controllers/interfaces/ICourse.controller";
import { Router } from "express";

const couponRouter = Router();

const courseController = container.get<ICourseController>(CourseController);

couponRouter.get("/", courseController.getCoupons.bind(courseController));
couponRouter.post("/", courseController.postCoupon.bind(courseController));
couponRouter.post("/apply", courseController.applyCoupon.bind(courseController));
couponRouter.put("/:couponId", courseController.editCoupon.bind(courseController));
couponRouter.delete("/:couponId", courseController.deleteCoupon.bind(courseController));

export default couponRouter;