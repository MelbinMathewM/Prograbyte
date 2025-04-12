import "reflect-metadata";

import { Container } from "inversify";

// Repository Interface
import { IAuthRepository } from "../repositories/interfaces/IAuth.repository";

// Service Interface
import { IAuthService } from "../services/interfaces/IAuth.service";

// Controller Interface
import { IAuthController } from "../controllers/interfaces/IAuth.controller";

// Repositories
import { AuthRepository } from "../repositories/implementations/auth.repository";

// Services
import { AuthService } from "../services/implementations/auth.service";

// Controllers
import { AuthController } from "../controllers/implementations/auth.controller";

const container = new Container({ defaultScope: "Singleton" });

// Bind repository
container.bind<IAuthRepository>("IAuthRepository").to(AuthRepository);

// Bind service
container.bind<IAuthService>(AuthService).toSelf();

// Bind controller
container.bind<IAuthController>(AuthController).toSelf();

export default container;
