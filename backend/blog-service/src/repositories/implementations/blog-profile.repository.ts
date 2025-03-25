import BlogProfile, { IBlogProfile } from "@/models/blog-profile.model";
import { BaseRepository } from "@/repositories/base.repository";
import { IBlogProfileRepository } from "../interfaces/IBlog-profile.repository";
import { injectable } from "inversify";

@injectable()
export class BlogProfileRepository extends BaseRepository<IBlogProfile> implements IBlogProfileRepository {
  constructor() {
    super(BlogProfile);
  }

}

export const blogProfileRepository = new BlogProfileRepository();
