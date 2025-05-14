import { NextFunction, Request, Response } from "express";

export interface ICourseController {
  createCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  changeCourseApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
  editCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  addRating(req: Request, res: Response, next: NextFunction): Promise<void>;
  getRatings(req: Request, res: Response, next: NextFunction): Promise<void>;

  getCoupons(req: Request, res: Response, next: NextFunction): Promise<void>;
  postCoupon(req: Request, res: Response, next: NextFunction): Promise<void>;
  applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void>;
  editCoupon(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  getOffers(req: Request, res: Response, next: NextFunction): Promise<void>;
  postOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
  applyOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
  editOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteOffer(req: Request, res: Response, next: NextFunction): Promise<void>;

}
