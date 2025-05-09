import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "@/services/implementations/course.service";
import { ICourse } from "@/models/course.model";
import { HttpResponse } from "@/constants/response.constant";
import stripe from "@/configs/stripe.config";
import { HttpStatus } from "@/constants/status.constant";
import { ICourseController } from "@/controllers/interfaces/ICourse.controller";

export class CourseController implements ICourseController {
  constructor(@inject(CourseService) private _courseService: CourseService) { }

  async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { title, description, category_id, tutor_id, price, poster_url, preview_video_urls } = req.body;

      if (!title || !description || !category_id || !tutor_id || isNaN(price) || !poster_url || !preview_video_urls) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
        return;
      }

      const newCourse = await this._courseService.createCourse(req.body as ICourse);

      res.status(HttpStatus.CREATED).json(newCourse);
    } catch (err) {
      next(err)
    }
  }




  async changeCourseApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;
      const { status } = req.body;

      await this._courseService.changeCourseStatus(courseId, status);

      res.sendStatus(HttpStatus.OK);
    } catch (err) {
      next(err)
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tutor_id, category_id, min_price, max_price, sort, search, status } = req.query;
      const filters: any = {};

      if (tutor_id) filters.tutor_id = tutor_id;
      if (category_id) filters.category_id = category_id;
      if (min_price) filters.price = { ...filters.price, $gte: Number(min_price) };
      if (max_price) filters.price = { ...filters.price, $lte: Number(max_price) };
      if (status) filters.status = status;

      if (search) {
        filters.$or = [
          { title: { $regex: search, $options: "i" } },
        ];
      }

      const courses = await this._courseService.getCourses(filters, sort as string);
      res.status(HttpStatus.OK).json({ courses });
    } catch (err) {
      next(err);
    }
  }


  async getCourseDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const course = await this._courseService.getCourseDetail(id);

      res.status(HttpStatus.OK).json({ course })
    } catch (err) {
      next(err);
    }
  }

  async editCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;

      const updatedCourse = await this._courseService.updateCourse(courseId, req.body);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COURSE_UPDATED, course: updatedCourse });
    } catch (err) {
      next(err);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COURSE_ID_REQUIRED });
        return;
      }

      await this._courseService.deleteCourse(courseId);

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

      await this._courseService.addRating(userId, courseId, rating, review);

      res.status(HttpStatus.OK).json({ message: HttpResponse.REVIEW_ADDED });
    } catch (err) {
      next(err);
    }
  }

  async getRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.params;

      if (!courseId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COURSE_ID_REQUIRED });
        return;
      }

      const reviews = await this._courseService.getRatings(courseId);

      res.status(HttpStatus.OK).json({ reviews });
    } catch (err) {
      next(err);
    }
  }
}