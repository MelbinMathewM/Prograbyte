import { Request, Response, NextFunction } from "express";

export interface IEnrolledCourseController {
  enrollCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEnrollCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateTopicProgress(req: Request, res: Response, next: NextFunction): Promise<void>;

}
