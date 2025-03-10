import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "../services/courseService";
import { ICategory } from "../models/categoryModel";
import { ICourse } from "../models/courseModel";
import { ITopic, Topic } from "../models/topicModel";
import { HttpResponse } from "../constants/responseMessage";
import stripe from "../config/stripe";
import { HttpStatus } from "../constants/status";

export class CourseController {
  constructor(@inject(CourseService) private courseService: CourseService) { }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category: ICategory = req.body;

      const newCategory = await this.courseService.createCategory(category);

      res.status(201).json(newCategory);
    } catch (err) {
      next(err)
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await this.courseService.getCategories();

      res.status(200).json(categories);
    } catch (err) {
      next(err)
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData: Partial<ICategory> = req.body;

      const updatedCategory = await this.courseService.updateCategory(id, updatedData);

      res.status(200).json(updatedCategory);
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await this.courseService.deleteCategory(id);

      res.status(200).json({ message: HttpResponse.CATEGORY_DELETED });
    } catch (err) {
      next(err);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Received Files:", req.files); // Debugging
      console.log("Received Body:", req.body); // Debugging

      const { title, description, category_id } = req.body;
      let { tutor_id } = req.body;
      const price = Number(req.body.price); // Convert price to number

      // Convert tutor_id to a string if it's an array
      if (Array.isArray(tutor_id)) {
        tutor_id = tutor_id[0]; // Take the first element
      }

      if (!title || !description || !category_id || !tutor_id || isNaN(price)) {
        res.status(400).json({ error: "Missing or invalid required fields" });
        return;
      }

      // **Handle file extraction based on array/object structure**
      let preview_video_files: Express.Multer.File[] = [];
      let poster_file: Express.Multer.File | null = null;

      if (Array.isArray(req.files)) {
        // If `req.files` is an array (Multer array upload)
        preview_video_files = req.files.filter((file) => file.fieldname === "preview_video");
        poster_file = req.files.find((file) => file.fieldname === "poster") || null;
      } else if (req.files && typeof req.files === "object") {
        // If `req.files` is an object (Multer field-based upload)
        preview_video_files = (req.files["preview_video"] || []) as Express.Multer.File[];
        poster_file = (req.files["poster"]?.[0] as Express.Multer.File) || null;
      }

      console.log("Extracted Files:", preview_video_files, poster_file);

      if (preview_video_files.length === 0) {
        res.status(400).json({ error: "At least one preview video is required" });
        return;
      }

      // Get file URLs
      const preview_video_urls = preview_video_files.map((file) => file.path);
      const poster_url = poster_file ? poster_file.path : "";

      const newCourseData: Partial<ICourse> = {
        title,
        description,
        category_id,
        tutor_id,
        price,
        preview_video_urls,
        poster_url,
      };

      const newCourse = await this.courseService.createCourse(newCourseData as ICourse);
      console.log("Course Created:", newCourse);

      res.status(201).json(newCourse);
    } catch (err) {
      next(err)
    }
  }




  async changeCourseApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const { status } = req.body;

      await this.courseService.changeCourseStatus(courseId, status);

      res.sendStatus(200);
    } catch (err) {
      next(err)
    }
  }

  async createTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { course_id } = req.body;
      let topics = req.body.topics;


      if (typeof topics === "string") {
        topics = JSON.parse(topics);
      }

      if (!course_id || !Array.isArray(topics)) {
        res.status(400).json({ error: "Missing required fields or invalid data format" });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      console.log(files, "files");

      const newTopics = topics.map((topic, index) => {
        const videoFile = Array.isArray(files) ? files.find(file => file.fieldname === `topics[${index}][video]`) : undefined;
        const notesFile = Array.isArray(files) ? files.find(file => file.fieldname === `topics[${index}][notes]`) : undefined;


        console.log(`Video File for topics[${index}]:`, videoFile?.path);
        console.log(`Notes File for topics[${index}]:`, notesFile?.path);
        return {
          course_id,
          title: topic.title,
          level: topic.level,
          video_url: videoFile?.path || "",
          notes_url: notesFile?.path || "",
        };
      });

      console.log(newTopics);


      const savedTopics = await this.courseService.createTopic(newTopics as ITopic[]);
      console.log('topic ok');
      res.status(201).json(savedTopics);
    } catch (err) {
      next(err);
    }
  }


  async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tutor_id, category_id } = req.query;

      if (tutor_id) {

        const courses = await this.courseService.getCoursesByTutorId(tutor_id as string);
        res.status(200).json(courses)

      } else if (category_id) {

        const courses = await this.courseService.getCoursesByCategoryId(category_id as string);
        res.status(200).json(courses)

      } else {

        const courses = await this.courseService.getCourses();
        res.status(200).json(courses)

      }
    } catch (err) {
      next(err)
    }
  }

  async getCourseDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const course = await this.courseService.getCourseDetail(id);

      res.status(200).json(course)
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async getTopics(req: Request, res: Response): Promise<void> {
    try {
      const { course_id } = req.params;

      console.log(course_id)

      const topics = await this.courseService.getTopics(course_id);

      res.status(200).json(topics);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async getTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;

      const topic = await this.courseService.getTopicById(topicId);

      res.status(200).json(topic);
    } catch (err) {
      next(err)
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      const files = req.files as Express.Multer.File[] | undefined;

      console.log(files, "files", req.body)

      const updatedCourse = await this.courseService.updateCourse(courseId, req.body, files);

      res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err as string)
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { amount, method } = req.body;

    console.log(req.body);

    if (method === "upi") {
      const upiLink = `upi://pay?pa=merchant@upi&pn=Merchant&mc=1234&tid=TXN12345&tr=ORDERID${Date.now()}&am=${amount}`;
      res.json({ upiLink });
      return;
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "inr",
        payment_method_types: ["card"],
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      next(err)
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.params;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
       return
     }

      const wishlist = await this.courseService.getWishlist(userId);

      res.status(HttpStatus.OK).json(wishlist);
    }catch(err){
      next(err)
    }
  }

  async addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId, courseId } = req.body;

      if (!userId) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
        return
      }
      if (!courseId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.COURSE_ID_REQUIRED });
       return
     }

     const wishlist = await this.courseService.addWishlist(userId, courseId);

     res.status(HttpStatus.OK).json({ message: HttpResponse.COURSE_ADDED_WISHLIST, wishlist });
    }catch(err){
      next(err)
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId, courseId } = req.params;

      if (!userId) {
         res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
        return
      }
      if (!courseId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.COURSE_ID_REQUIRED });
       return
     }

     await this.courseService.removeWishlist(userId, courseId);

     res.status(HttpStatus.OK).json({message: HttpResponse.COURSE_REMOVED_WISHLIST})
    }catch(err){
      next(err)
    }
  }
}