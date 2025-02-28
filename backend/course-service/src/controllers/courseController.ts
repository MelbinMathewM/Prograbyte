import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { CourseService } from "../services/courseService";
import { ICategory } from "../models/categoryModel";
import { ICourse } from "../models/courseModel";
import { ITopic, Topic } from "../models/topicModel";
import { HttpResponse } from "../constants/responseMessage";

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

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const { course } = req.body;

      const { title, description, category_id, tutor_id, price } = course;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const preview_video_file = Object.values(files || {}).flat().find(file => file.fieldname === "course[preview_video]");
      const poster_file = Object.values(files || {}).flat().find(file => file.fieldname === "course[poster]");

      const preview_video_url = preview_video_file?.path || "";
      const poster_url = poster_file?.path || "";

      console.log(title,description,category_id, tutor_id, price)

      if (!title || !description || !category_id || !tutor_id || !price) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const courses: Partial<ICourse> = {
        title,
        description,
        category_id,
        tutor_id,
        price,
        preview_video_url,
        poster_url
      };

      const newCourse = await this.courseService.createCourse(courses as ICourse);
      console.log('ok')
      res.status(201).json(newCourse);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async changeCourseApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { courseId } = req.params;
      const { status } = req.body;

      await this.courseService.changeCourseStatus(courseId,status);

      res.sendStatus(200);
    }catch(err){
      next(err)
    }
  }

  async createTopic(req: Request, res: Response): Promise<void> {
    try {
      const { course_id, topics } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!course_id || !topics || !Array.isArray(topics)) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const fileMap: { [key: string]: string } = {};
      files?.forEach((file) => {
        fileMap[file.fieldname] = file.path;
      });

      const newTopics = topics.map((topic, index) => ({
        course_id,
        title: topic.title,
        level: topic.level,
        video_url: fileMap[`video_${index}`] || "",
        notes_url: fileMap[`notes_${index}`] || "",
      }));

      const savedTopics = await this.courseService.createTopic(newTopics as ITopic[]);
      console.log('topic ok')
      res.status(201).json(savedTopics);

    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async getCourses(req: Request,res: Response, next: NextFunction): Promise<void> {
    try{
      const { tutor_id, category_id } = req.query;

      if(tutor_id) {

        const courses = await this.courseService.getCoursesByTutorId(tutor_id as string);
        res.status(200).json(courses)

      } else if(category_id) {

        const courses = await this.courseService.getCoursesByCategoryId(category_id as string);
        res.status(200).json(courses)

      } else {

        const courses = await this.courseService.getCourses();
        res.status(200).json(courses)

      }
    }catch (err) {
      next(err)
    }
  }

  async getCourseDetail(req: Request, res: Response): Promise<void> {
    try{
      const { id } = req.params;

      const course = await this.courseService.getCourseDetail(id);

      res.status(200).json(course)
    }catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async getTopics(req: Request, res: Response): Promise<void> {
    try{
      const { course_id } = req.params;

      console.log(course_id)

      const topics = await this.courseService.getTopics(course_id);

      res.status(200).json(topics);
    }catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }

  async editCourse(req: Request, res: Response): Promise<void> {
    try{
      const { courseId } = req.params;

      const updatedCourse = await this.courseService.updateCourse(courseId, req.body, req.files);

      res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    }catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        console.log(err as string)
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }
}