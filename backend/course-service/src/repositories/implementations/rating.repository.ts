import CourseRating, { IRating } from "@/models/rating.model";
import { BaseRepository } from "@/repositories/base.repository";
import { injectable } from "inversify";

@injectable()
export class RatingRepository extends BaseRepository<IRating> {
    constructor() {
        super(CourseRating);
    }
}