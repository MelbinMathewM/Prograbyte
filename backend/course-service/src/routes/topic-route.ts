import { Router } from "express";
import container from "@/configs/inversify.config";
import { TopicController } from "@/controllers/implementations/topic.controller";
import { attachFilesToTopics } from "@/middlewares/attach-files.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { topicsSchema } from "@/schemas/add-topic.schema";
import { editTopicSchema } from "@/schemas/edit-topic.schema";
import { uploadTopic } from "@/configs/multer.config";

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
