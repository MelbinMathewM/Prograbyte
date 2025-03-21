import { HttpResponse } from "@/constants/responseMessage";
import { HttpStatus } from "@/constants/status";
import { EnrolledCourseService } from "@/services/implementations/enrolledCourseService";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { IEnrolledCourseController } from "../interfaces/IEnrolledCourseController";

export class EnrolledCourseController implements IEnrolledCourseController {
    constructor(@inject(EnrolledCourseService) private enrolledCourseService: EnrolledCourseService) { }

    async enrollCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
          const { courseId, userId, paymentAmount, paymentId } = req.body;
    
          await this.enrolledCourseService.enrollCourse(courseId, userId, paymentAmount, paymentId);
          
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
    
          const enrolledCourses = await this.enrolledCourseService.getEnrolledCourses(userId);
    
          res.status(HttpStatus.OK).json({enrolledCourses});
        }catch(err){
          next(err);
        }
      }
}
  