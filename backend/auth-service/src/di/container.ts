import "reflect-metadata";
import { Container } from "inversify";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../services/AuthService";
import { IAuthRepository } from "../repositories/interfaces/IAuthRepository";
import { AuthRepository } from "../repositories/implementations/AuthRepository";

const container = new Container({ defaultScope: "Singleton" });

// Bind repository
container.bind<IAuthRepository>("IAuthRepository").to(AuthRepository);

// Bind service
container.bind<AuthService>(AuthService).toSelf();

// Bind controller
container.bind<AuthController>(AuthController).toSelf();

export default container;
