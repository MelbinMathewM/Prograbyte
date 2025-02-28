import { Container } from "inversify";
import { NotificationController } from "../controllers/otpController";
import { OtpService } from "../services/otpService";

const container = new Container();

container.bind<OtpService>(OtpService).toSelf();
container.bind<NotificationController>(NotificationController).toSelf();

export default container;
