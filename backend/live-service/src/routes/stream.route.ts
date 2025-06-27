import container from "../configs/inversify.config";
import { StreamController } from "../controllers/implementations/stream.controller";
import { IStreamController } from "../controllers/interfaces/IStream.controller";
import { Router } from "express";

const streamRouter = Router();
const streamController = container.get<IStreamController>(StreamController);

streamRouter.post('/start-stream',streamController.startStream.bind(streamController));
streamRouter.post('/stop-stream',streamController.stopStream.bind(streamController));

export default streamRouter;