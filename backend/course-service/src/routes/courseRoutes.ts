import {Router} from "express";
import container from "../di/container";
import multer from "multer";
import { CourseController } from "../controllers/courseController";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

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
    params: async () => ({
        folder: "prograbyte/topics",
        resource_type: "auto",
    }),
});

const uploadCourse = multer({ storage: storageCourse });
const uploadTopic = multer({ storage: storageTopic });

//category routes
courseRouter.post('/categories',(req, res,next) => courseController.createCategory(req, res,next));
courseRouter.get('/categories',(req,res,next) => courseController.getCategories(req, res,next));
courseRouter.put('/categories/:id',(req,res,next) => courseController.updateCategory(req,res,next));
courseRouter.delete('/categories/:id',(req,res,next) => courseController.deleteCategory(req,res,next));

courseRouter.get('/courses',(req,res,next) => courseController.getCourses(req,res,next));
courseRouter.get('/courses/:id',(req,res) => courseController.getCourseDetail(req,res));
courseRouter.put('/courses/:courseId',uploadCourse.any(),(req,res) => courseController.editCourse(req,res));
courseRouter.post('/courses',uploadCourse.any(),(req,res) => courseController.createCourse(req,res));
courseRouter.patch('/courses/:courseId/status',(req,res,next) => courseController.changeCourseApprovalStatus(req,res,next));

courseRouter.get('/topics/:course_id',(req,res) => courseController.getTopics(req,res));
courseRouter.post('/topics',uploadTopic.any(),(req,res) => courseController.createTopic(req,res));

export default courseRouter;