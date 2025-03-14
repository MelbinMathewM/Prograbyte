import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { HttpResponse } from "../constants/responseMessage";
import { HttpStatus } from "../constants/status";
import formatZodErrors from "../utils/formatZodError";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {

      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error("Zod Validation Error:", error);
        res.status(HttpStatus.BAD_REQUEST).json({
          error: error.errors[0]?.message,
          details: formatZodErrors(error),
        });
        return;
      }
      next(error);
    }
  };
