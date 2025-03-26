import container from "@/configs/inversify.config";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";
import { consumeMessages } from "@/utils/rabbitmq.util";

export const userRegisteredConsumer = async () => {
    console.log("hii")
    const blogProfileController = container.get<IBlogProfileController>(BlogProfileController);

    await consumeMessages(
        "blog_user_registered",
        "user_service",
        "user.registered.blog",
        async (msg) => {

            const { _id, username } = JSON.parse(msg.content.toString());
            console.log(_id, username, 'kjkjk')
            await blogProfileController.createBlogUser(_id, username);
        }
    );
};
