import "reflect-metadata";
import { Container } from "inversify";

// Repositories
import { PostRepository } from "@/repositories/implementations/post.repository";
import { CommentRepository } from "@/repositories/implementations/comment.repository";

// Services
import { PostService } from "@/services/implementations/post.service";

// Controllers
import { PostController } from "@/controllers/implemetations/post.controller";

// Interfaces
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { ICommentRepository } from "@/repositories/interfaces/IComment.repository";
import { IPostService } from "@/services/interfaces/IPost.service";
import { IPostController } from "@/controllers/interfaces/IPost.controller";

const container = new Container({ defaultScope: "Singleton" });

// Repository Binding
container.bind<IPostRepository>("IPostRepository").to(PostRepository);
container.bind<ICommentRepository>("ICommentRepository").to(CommentRepository);

// Service Binding
container.bind<IPostService>(PostService).toSelf();

// Container Binding
container.bind<IPostController>(PostController).toSelf();

export default container;