import { Container } from "inversify";
import { NotificationController } from "../controllers/notificationController";
import { NotificationService } from "../services/notificationService";

const container = new Container();

container.bind<NotificationService>(NotificationService).toSelf();
container.bind<NotificationController>(NotificationController).toSelf();

export default container;
