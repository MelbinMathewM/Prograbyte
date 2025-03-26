import "reflect-metadata";
import { Container } from "inversify";

// Repositories
import { PostRepository } from "@/repositories/implementations/post.repository";
import { CommentRepository } from "@/repositories/implementations/comment.repository";
import { BlogProfileRepository } from "@/repositories/implementations/blog-profile.repository";
import { SocketRepository } from "@/repositories/implementations/socket.repository";
import { ConversationRepository } from "@/repositories/implementations/conversation.repository";
import { MessageRepository } from "@/repositories/implementations/message.repository";

// Services
import { PostService } from "@/services/implementations/post.service";
import { BlogProfileService } from "@/services/implementations/blog-profile.service";
import { SocketService } from "@/services/implementations/socket.service";

// Controllers
import { PostController } from "@/controllers/implemetations/post.controller";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";

// Repository Interfaces
import { IPostRepository } from "@/repositories/interfaces/IPost.repository";
import { ICommentRepository } from "@/repositories/interfaces/IComment.repository";
import { IBlogProfileRepository } from "@/repositories/interfaces/IBlog-profile.repository";
import { ISocketRepository } from "@/repositories/interfaces/ISocket.repository";
import { IConversationRepository } from "@/repositories/interfaces/IConversation.repository";
import { IMessageRepository } from "@/repositories/interfaces/IMessage.repository";

// Service Interfaces
import { IPostService } from "@/services/interfaces/IPost.service";
import { IBlogProfileService } from "@/services/interfaces/IBlog-profile.service";
import { ISocketService } from "@/services/interfaces/ISocket.service";

// Controller Interfaces
import { IPostController } from "@/controllers/interfaces/IPost.controller";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";

const container = new Container({ defaultScope: "Singleton" });

// Repository Binding
container.bind<IPostRepository>("IPostRepository").to(PostRepository);
container.bind<ICommentRepository>("ICommentRepository").to(CommentRepository);
container.bind<IBlogProfileRepository>("IBlogProfileRepository").to(BlogProfileRepository);
container.bind<ISocketRepository>("ISocketRepository").to(SocketRepository);
container.bind<IConversationRepository>("IConversationRepository").to(ConversationRepository);
container.bind<IMessageRepository>("IMessageRepository").to(MessageRepository);


// Service Binding
container.bind<IPostService>(PostService).toSelf();
container.bind<IBlogProfileService>(BlogProfileService).toSelf();
container.bind<ISocketService>("SocketService").to(SocketService);

// Container Binding
container.bind<IPostController>(PostController).toSelf();
container.bind<IBlogProfileController>(BlogProfileController).toSelf();

export default container;