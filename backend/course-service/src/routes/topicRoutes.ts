import { Router } from "express";
import container from "@/di/container";
import { TopicController } from "@/controllers/implementations/topicController";
import { attachFilesToTopics } from "@/middlewares/attachFiles";
import { validate } from "@/middlewares/validateMiddleware";
import { topicsSchema } from "@/schemas/addTopicsSchema";
import { editTopicSchema } from "@/schemas/editTopicSchema";
import { uploadTopic } from "@/config/multer";

const topicRouter = Router();
const topicController = container.get<TopicController>(TopicController);

// Topic routes
topicRouter.get("/secure-token", topicController.videoUrlToken.bind(topicController));
topicRouter.get("/secure-url/:token", topicController.getSecureUrl.bind(topicController));
topicRouter.get("/proxy-stream/:token", topicController.proxyStream.bind(topicController));

topicRouter.post("/",uploadTopic,attachFilesToTopics,validate(topicsSchema), topicController.createTopic.bind(topicController));
topicRouter.get("/:courseId", topicController.getTopics.bind(topicController));

topicRouter.put("/:topicsId/:topicId",uploadTopic,attachFilesToTopics,validate(editTopicSchema), topicController.editTopic.bind(topicController));
topicRouter.get("/:topicsId/:topicId", topicController.getTopic.bind(topicController));
topicRouter.delete("/:topicsId/:topicId", topicController.removeTopic.bind(topicController));


export default topicRouter;
