import { StreamController } from "../controllers/implementations/stream.controller";
import { Router } from "express";

const streamRouter = Router();
const streamController = new StreamController();

streamRouter.post('/start-stream',streamController.startStream.bind(streamController));
streamRouter.post('/stop-stream',streamController.stopStream.bind(streamController));

export default streamRouter;