import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "../services/courseService";
import { ICategory } from "../models/categoryModel";
import { ICourse } from "../models/courseModel";
import { ITopic, ITopics, Topic } from "../models/topicModel";
import { HttpResponse } from "../constants/responseMessage";
import stripe from "../config/stripe";
import { HttpStatus } from "../constants/status";
import axios from 'axios';

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
      console.log("Received Body:", req.body);

      const { title, description, category_id, tutor_id, price, poster_url, preview_video_urls } = req.body;

      if (!title || !description || !category_id || !tutor_id || isNaN(price) || !poster_url || !preview_video_urls) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
        return;
      }

      const newCourse = await this.courseService.createCourse(req.body as ICourse);

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
      const { course_id, topics } = req.body;

      if (!course_id || !Array.isArray(topics)) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
        return;
      }

      const savedTopics = await this.courseService.createTopic(req.body as ITopics);
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

      const { topicsId, topicId } = req.params;

      const topic = await this.courseService.getTopicById(topicsId, topicId);

      console.log(topic,'j')

      res.status(200).json(topic);
    } catch (err) {
      next(err)
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

      console.log(req.body,"req,body");

      const updatedCourse = await this.courseService.updateCourse(courseId, req.body);

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

      console.log(paymentIntent.client_secret,'client_secret')

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      next(err)
    }
  }

  async erollCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { courseId, userId, paymentAmount, paymentId } = req.body;

      await this.courseService.enrollCourse(courseId, userId, paymentAmount, paymentId);
      
      res.status(HttpStatus.OK).json({message: HttpResponse.COURSE_ENROLLED})
    }catch(err){
      next(err)
    }
  }

  async getEnrollCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.params;

      if(!userId){
        res.status(HttpStatus.BAD_REQUEST).json({message: HttpResponse.USER_ID_REQUIRED});
      }

      const enrolledCourses = await this.courseService.getEnrolledCourses(userId);

      res.status(HttpStatus.OK).json({enrolledCourses});
    }catch(err){
      next(err);
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
        return
      }

      const wishlist = await this.courseService.getWishlist(userId);

      res.status(HttpStatus.OK).json(wishlist);
    } catch (err) {
      next(err)
    }
  }

  async addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
    } catch (err) {
      next(err)
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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

      res.status(HttpStatus.OK).json({ message: HttpResponse.COURSE_REMOVED_WISHLIST })
    } catch (err) {
      next(err)
    }
  }

  async videoUrlToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { publicId } = req.query;

      if (!publicId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.PUBLIC_ID_NOT_FOUND });
        return;
      }

      const token = await this.courseService.getVideoToken(publicId as string);

      res.status(HttpStatus.OK).json({ token });
    } catch (err) {
      next(err)
    }
  }

  async getSecureUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const accessToken = req.headers.authorization;

      console.log(token, 'token')
      console.log("Received Access Token:", accessToken);

      if (!accessToken) {
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_ACCESS_TOKEN);
        return;
      }

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json(HttpResponse.NO_TOKEN);
        return
      }

      const secureUrl = await this.courseService.getSecureVideo(token as string);

      const videoUrl = `/course/proxy-stream/${token}?access_toekn=${accessToken.replace("Bearer ", "")}`;

      res.status(HttpStatus.OK).json({ videoUrl });

    } catch (err) {
      next(err)
    }
  }

  async proxyStream(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const accessToken = req.query.access_token as string;

      console.log("Proxy Streaming Token:", token);
      console.log("Access Token:", accessToken);

      if (!token || !accessToken) {
        res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.NO_TOKEN);
      }

      const secureUrl = await this.courseService.getSecureVideo(token);

      const videoStream = await axios({
        method: "get",
        url: secureUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "stream",
      });

      res.setHeader("Content-Type", "video/mp4");
      videoStream.data.pipe(res);

    } catch (err) {
      next(err);
    }
  }

}