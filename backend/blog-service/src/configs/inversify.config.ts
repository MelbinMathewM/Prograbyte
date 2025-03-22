import "reflect-metadata";
import { Container } from "inversify";

// Repositories
import { PostRepository } from "@/repositories/implementations/post.repository";

// Services
import { PostService } from "@/services/implementations/post.service";

// Controllers
import { PostController } from "@/controllers/implemetations/post.controller";

// Interfaces
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { IPostService } from "@/services/interfaces/IPost.service";
import { IPostController } from "@/controllers/interfaces/post.controller";

const container = new Container({ defaultScope: "Singleton" });

// Repository Binding
container.bind<IPostRepository>("IPostRepository").to(PostRepository);

// Service Binding
container.bind<IPostService>(PostService).toSelf();

// Container Binding
container.bind<IPostController>(PostController).toSelf();

export default container;