import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "@/services/implementations/course.service";
import { ICourse } from "@/models/course.model";
import { HttpResponse } from "@/constants/response.constant";
import stripe from "@/configs/stripe.config";
import { HttpStatus } from "@/constants/status.constant";
import { ICourseController } from "@/controllers/interfaces/ICourse.controller";

export class CourseController implements ICourseController {
  constructor(@inject(CourseService) private courseService: CourseService) { }

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

  async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tutor_id, category_id, min_price, max_price, sort, search } = req.query;
      const filters: any = {};

      if (tutor_id) filters.tutor_id = tutor_id;
      if (category_id) filters.category_id = category_id;
      if (min_price) filters.price = { ...filters.price, $gte: Number(min_price) };
      if (max_price) filters.price = { ...filters.price, $lte: Number(max_price) };

      if (search) {
        filters.$or = [
            { title: { $regex: search, $options: "i" } },
        ];
    }

      const courses = await this.courseService.getCourses(filters, sort as string);
      res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  }


  async getCourseDetail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const course = await this.courseService.getCourseDetail(id);

      res.status(200).json({ course })
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;

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

  async deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COURSE_ID_REQUIRED });
        return;
      }

      await this.courseService.deleteCourse(courseId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COURSE_DELETED });
    } catch (err) {
      next(err);
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

      console.log(paymentIntent.client_secret, 'client_secret')

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      next(err)
    }
  }

  async addRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, courseId, rating, review } = req.body;

      await this.courseService.addRating(userId, courseId, rating, review);

      res.status(HttpStatus.OK).json({ message: HttpResponse.REVIEW_ADDED });
    } catch (err) {
      next(err);
    }
  }

  async getRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { courseId } = req.params;

    if (!courseId) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COURSE_ID_REQUIRED });
      return;
    }

    const reviews = await this.courseService.getRatings(courseId);

    res.status(HttpStatus.OK).json({ reviews });
  }
}