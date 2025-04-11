import "reflect-metadata";
import { Container } from "inversify";

// Repository Interfaces
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";

// Service Interfaces
import { IUserService } from "@/services/interfaces/IUser.service";

// Controller Interfaces
import { IUserController } from "@/controllers/interfaces/IUser.controller";

// Repositories
import { UserRepository } from "@/repositories/implementations/user.repository";

// Services
import { UserService } from "@/services/implementations/user.service";

// Controllers
import { UserController } from "@/controllers/implementations/user.controller";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);

container.bind<IUserService>(UserService).toSelf();

container.bind<IUserController>(UserController).toSelf();

export default container;