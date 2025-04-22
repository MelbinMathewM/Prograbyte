import "reflect-metadata";
import { Container } from "inversify";

// Repository Interfaces
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";
import { IWalletRepository } from "@/repositories/interfaces/IWallet.repository";

// Service Interfaces
import { IUserService } from "@/services/interfaces/IUser.service";
import { IWalletService } from "@/services/interfaces/IWallet.service";

// Controller Interfaces
import { IUserController } from "@/controllers/interfaces/IUser.controller";
import { IWalletController } from "@/controllers/interfaces/IWallet.controller";

// Repositories
import { UserRepository } from "@/repositories/implementations/user.repository";
import { WalletRepository } from "@/repositories/implementations/wallet.repository";

// Services
import { UserService } from "@/services/implementations/user.service";
import { WalletService } from "@/services/implementations/wallet.service";

// Controllers
import { UserController } from "@/controllers/implementations/user.controller";
import { WalletController } from "@/controllers/implementations/wallet.controller";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IWalletRepository>("IWalletRepository").to(WalletRepository);

container.bind<IUserService>(UserService).toSelf();
container.bind<IWalletService>(WalletService).toSelf();

container.bind<IUserController>(UserController).toSelf();
container.bind<IWalletController>(WalletController).toSelf();

export default container;