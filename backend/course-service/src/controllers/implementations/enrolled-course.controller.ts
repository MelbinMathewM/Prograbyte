import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { EnrolledCourseService } from "@/services/implementations/enrolled-course.service";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { IEnrolledCourseController } from "../interfaces/IEnrolled-course.controller";

export class EnrolledCourseController implements IEnrolledCourseController {
  constructor(@inject(EnrolledCourseService) private _enrolledCourseService: EnrolledCourseService) { }

  async enrollCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courseId, userId, paymentAmount, paymentId } = req.body;

      await this._enrolledCourseService.enrollCourse(courseId, userId, paymentAmount, paymentId);

      res.status(HttpStatus.OK).json({ message: HttpResponse.COURSE_ENROLLED })
    } catch (err) {
      next(err)
    }
  }

  async getEnrollCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
        return;
      }

      const enrolledCourses = await this._enrolledCourseService.getEnrolledCourses(userId);

      res.status(HttpStatus.OK).json({ enrolledCourses });
    } catch (err) {
      next(err);
    }
  }

  async updateTopicProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: HttpResponse.USER_ID_REQUIRED });
        return;
      }

      const { courseId, topicId, watchedDuration, totalDuration } = req.body;

      await this._enrolledCourseService.updateTopicProgress(userId, courseId, topicId, watchedDuration, totalDuration);

      res.status(HttpStatus.OK).json({ message: HttpResponse.TOPIC_PROGRESS_UPDATED });
    } catch (err) {
      next(err);
    }
  }

}
