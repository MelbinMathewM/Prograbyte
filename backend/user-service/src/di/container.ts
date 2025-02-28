import "reflect-metadata";
import { Container } from "inversify";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/implementations/UserRepository";
import { UserService } from "../services/UserService";
import { UserController } from "../controllers/UserController";

const container = new Container();
container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<UserService>(UserService).toSelf();
container.bind<UserController>(UserController).toSelf();

export default container;