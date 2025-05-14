import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "@/services/implementations/course.service";
import { ICourse } from "@/models/course.model";
import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { ICourseController } from "@/controllers/interfaces/ICourse.controller";
import logger from "@/utils/logger.util";

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
      const { courseId } = req.params;

      const course = await this._courseService.getCourseDetail(courseId);

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

  async getCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('hii')
    try {
      const coupons = await this._courseService.getCoupons();

      res.status(HttpStatus.OK).json({ coupons });
    } catch (err) {
      next(err);
    }
  }

  async postCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, discount, isLiveStream } = req.body;

      const newCoupon = await this._courseService.postCoupon(code, discount, isLiveStream);

      res.status(HttpStatus.CREATED).json({ coupon: newCoupon });
    } catch (err) {
      next(err);
    }
  }

  async applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { code, userId } = req.body;


      const coupon = await this._courseService.applyCoupon(code, userId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COUPON_APPLIED, success: true, coupon})
    }catch(err){
      next(err);
    }
  }

  async editCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { couponId } = req.params;

      if (!couponId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COUPON_ID_REQUIRED });
        return;
      }

      const { updateData } = req.body;

      const updatedCoupon = await this._courseService.editCoupon(couponId, updateData);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COUPON_EDITED, coupon: updatedCoupon });
    } catch (err) {
      next(err);
    }
  }

  async deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { couponId } = req.params;

      if (!couponId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.COUPON_ID_REQUIRED });
        return;
      }

      await this._courseService.deleteCoupon(couponId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COUPON_DELETED });
    } catch (err) {
      next(err);
    }
  }

  async getOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('hii')
      const offers = await this._courseService.getOffers();

      res.status(HttpStatus.OK).json({ offers });
    } catch (err) {
      next(err);
    }
  }

  async postOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, discount, expiryDate } = req.body;

      const newOffer = await this._courseService.postOffer(title, description, discount, expiryDate);

      res.status(HttpStatus.CREATED).json({ offer: newOffer });
    } catch (err) {
      next(err);
    }
  }

  async applyOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId, offerId } = req.body;

      await this._courseService.applyOfferToCourse(courseId, offerId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OFFER_APPLIED });
    } catch (err) {
      next(err);
    }
  };

  async removeOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId } = req.body;

      await this._courseService.removeOfferFromCourse(courseId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OFFER_REMOVED });
    } catch(err) {
      next(err);
    }
  }

  async editOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { offerId } = req.params;

      if (!offerId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.OFFER_ID_REQUIRED });
        return;
      }

      const { updateData } = req.body;

      await this._courseService.editOffer(offerId, updateData);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OFFER_EDITED });
    } catch (err) {
      next(err);
    }
  }

  async deleteOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { offerId } = req.params;

      if (!offerId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.OFFER_ID_REQUIRED });
        return;
      }

      await this._courseService.deleteOffer(offerId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OFFER_DELETD });
    } catch (err) {
      next(err);
    }
  }
}