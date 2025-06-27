import "reflect-metadata";
import { Container } from "inversify";

// Interfaces
import { IStreamController } from "../controllers/interfaces/IStream.controller";
import { IStreamService } from "../services/interfaces/IStream.service";

// Services
import { StreamService } from "../services/implementations/stream.service";

// Controllers
import { StreamController } from "../controllers/implementations/stream.controller";

const container = new Container({ defaultScope: "Singleton" });

container.bind<IStreamService>(StreamService).toSelf();
container.bind<IStreamController>(StreamController).toSelf();

export default container;