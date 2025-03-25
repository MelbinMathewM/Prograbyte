import "reflect-metadata";
import { Container } from "inversify";

// Repositories
import { PostRepository } from "@/repositories/implementations/post.repository";
import { CommentRepository } from "@/repositories/implementations/comment.repository";
import { BlogProfileRepository } from "@/repositories/implementations/blog-profile.repository";

// Services
import { PostService } from "@/services/implementations/post.service";
import { BlogProfileService } from "@/services/implementations/blog-profile.service";

// Controllers
import { PostController } from "@/controllers/implemetations/post.controller";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";

// Repository Interfaces
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { ICommentRepository } from "@/repositories/interfaces/IComment.repository";
import { IBlogProfileRepository } from "@/repositories/interfaces/IBlog-profile.repository";

// Service Interfaces
import { IPostService } from "@/services/interfaces/IPost.service";
import { IBlogProfileService } from "@/services/interfaces/IBlog-profile.service";

// Controller Interfaces
import { IPostController } from "@/controllers/interfaces/IPost.controller";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";

const container = new Container({ defaultScope: "Singleton" });

// Repository Binding
container.bind<IPostRepository>("IPostRepository").to(PostRepository);
container.bind<ICommentRepository>("ICommentRepository").to(CommentRepository);
container.bind<IBlogProfileRepository>("IBlogProfileRepository").to(BlogProfileRepository);

// Service Binding
container.bind<IPostService>(PostService).toSelf();
container.bind<IBlogProfileService>(BlogProfileService).toSelf();

// Container Binding
container.bind<IPostController>(PostController).toSelf();
container.bind<IBlogProfileController>(BlogProfileController).toSelf();

export default container;