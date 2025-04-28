import container from "@/configs/inversify.config";
import { CourseController } from "@/controllers/implementations/course.controller";
import { ICourseController } from "@/controllers/interfaces/ICourse.controller";
import { Router } from "express";

const offerRouter = Router();

const courseController = container.get<ICourseController>(CourseController);

offerRouter.get("/", courseController.getOffers.bind(courseController));
offerRouter.post("/", courseController.postOffer.bind(courseController));
offerRouter.put("/:offerId", courseController.editOffer.bind(courseController));
offerRouter.delete("/:offerId", courseController.deleteOffer.bind(courseController));
offerRouter.post("/apply", courseController.applyOffer.bind(courseController));
offerRouter.post("/remove", courseController.removeOffer.bind(courseController));

export default offerRouter;

