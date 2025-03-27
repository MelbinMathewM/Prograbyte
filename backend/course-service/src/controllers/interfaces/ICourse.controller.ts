import { NextFunction, Request, Response } from "express";

export interface ICourseController {
  createCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeCourseApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
  editCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
