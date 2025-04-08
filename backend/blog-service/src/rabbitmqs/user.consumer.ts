import container from "@/configs/inversify.config";
import { BlogProfileController } from "@/controllers/implemetations/blog-profile.controller";
import { PostController } from "@/controllers/implemetations/post.controller";
import { IBlogProfileController } from "@/controllers/interfaces/IBlog-profile.controller";
import { IPostController } from "@/controllers/interfaces/IPost.controller";
import { consumeMessages } from "@/utils/rabbitmq.util";

export const userRegisteredConsumer = async () => {
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

export const usernameChangeConsumer = async () => {

    const blogProfileController = container.get<IBlogProfileController>(BlogProfileController);
    const postController = container.get<IPostController>(PostController);

    await consumeMessages(
        "blog_username_changed",
        "user_service",
        "username.updated.blog",
        async(msg) => {
            const { updatedUser, userId } = JSON.parse(msg.content.toString());
            
            await blogProfileController.updateUsername(updatedUser, userId);
            await postController.updatePostUsername(updatedUser, userId);
        }
    )
}

