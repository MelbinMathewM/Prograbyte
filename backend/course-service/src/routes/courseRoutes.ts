import {Router} from "express";
import container from "../di/container";
import multer from "multer";
import { CourseController } from "../controllers/courseController";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { validate } from "../middlewares/validateMiddleware";
import { courseSchema } from "../schemas/addCourseSchema";
import { attachFilesToCourse, attachFilesToTopics} from "../middlewares/attachFiles";
import { topicsSchema } from "../schemas/addTopicsSchema";
import { editCourseSchema } from "../schemas/editCourseSchema";
import { editTopicSchema } from "../schemas/editTopicSchema";

const courseRouter = Router();

const courseController = container.get(CourseController);

const storageCourse = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async () => ({
        folder: "prograbyte/courses",
        resource_type: "auto",
    }),
});

const storageTopic = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "prograbyte/topics",
        resource_type: file.mimetype.startsWith("video/") ? "video" : file.mimetype === "application/pdf" ? "raw" : "auto",
        type: file.mimetype.startsWith("video/") ? "authenticated" : "upload",
    }),
});

const uploadCourse = multer({
    storage: storageCourse,
}).any();

const uploadTopic = multer({ storage: storageTopic });

//category routes
courseRouter.post('/categories',(req, res,next) => courseController.createCategory(req, res,next));
courseRouter.get('/categories',(req,res,next) => courseController.getCategories(req, res,next));
courseRouter.put('/categories/:id',(req,res,next) => courseController.updateCategory(req,res,next));
courseRouter.delete('/categories/:id',(req,res,next) => courseController.deleteCategory(req,res,next));

courseRouter.get('/courses',(req,res,next) => courseController.getCourses(req,res,next));
courseRouter.get('/courses/:id',(req,res) => courseController.getCourseDetail(req,res));
courseRouter.post('/courses',uploadCourse,attachFilesToCourse,validate(courseSchema),(req,res,next) => courseController.createCourse(req,res,next));
courseRouter.put('/courses/:courseId',uploadCourse,attachFilesToCourse,validate(editCourseSchema),(req,res) => courseController.editCourse(req,res));
courseRouter.delete('/courses/:courseId',(req,res,next) => courseController.deleteCourse(req,res,next));
courseRouter.patch('/courses/:courseId/status',(req,res,next) => courseController.changeCourseApprovalStatus(req,res,next));

courseRouter.get('/topics/:course_id',(req,res) => courseController.getTopics(req,res));
courseRouter.post('/topics',uploadTopic.any(),attachFilesToTopics,validate(topicsSchema),(req,res,next) => courseController.createTopic(req,res,next));
courseRouter.put('/topics/:topicsId/:topicId',uploadTopic.any(),attachFilesToTopics,validate(editTopicSchema),(req,res,next) => courseController.editTopic(req,res,next));
courseRouter.delete('/topics/:topicsId/:topicId',(req,res,next) => courseController.removeTopic(req,res,next));
courseRouter.get('/topics/:topicsId/topic/:topicId',(req,res,next) => courseController.getTopic(req,res,next));

courseRouter.get('/secure-video-token',(req,res,next) => courseController.videoUrlToken(req,res,next));
courseRouter.get('/secure-url/:token',(req,res,next) => courseController.getSecureUrl(req,res,next));
courseRouter.get('/proxy-stream/:token',(req,res,next) => courseController.proxyStream(req,res,next));

courseRouter.get('/wishlist/:userId',(req,res,next) => courseController.getWishlist(req,res,next));
courseRouter.post('/wishlist',(req,res,next) => courseController.addToWishlist(req,res,next));
courseRouter.delete('/wishlist/:userId/:courseId',(req,res,next) => courseController.removeFromWishlist(req,res,next));

courseRouter.post('/payments',(req,res,next) => courseController.createPayment(req,res,next));
courseRouter.post('/enroll',(req,res,next) => courseController.erollCourse(req,res,next));
courseRouter.get('/enroll/:userId',(req,res,next) => courseController.getEnrollCourses(req,res,next));

export default courseRouter;