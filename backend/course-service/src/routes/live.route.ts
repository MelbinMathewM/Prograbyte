import { LiveController } from "@/controllers/implementations/live.controller";
import container from "@/configs/inversify.config";
import { Router } from "express";

const liveRouter = Router();
const liveController = container.get<LiveController>(LiveController);

liveRouter.post('/',liveController.postLiveSchedule.bind(liveController));
liveRouter.get('/', liveController.getLiveSchedule.bind(liveController));
liveRouter.patch('/:schedule_id/status', liveController.changeLiveScheduleStatus.bind(liveController));
liveRouter.get('/:schedule_id/check', liveController.checkLiveScheduleStatus.bind(liveController));

export default liveRouter;