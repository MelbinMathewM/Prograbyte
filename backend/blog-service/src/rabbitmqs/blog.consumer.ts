import { consumeMessages } from "@/utils/rabbitmq.util";

export const blogEventConsumer = async () => {
    await consumeMessages(
        "blog_event_queue",
        "blog_service",
        "blog.event",
        async (msg) => {
            const data = JSON.parse(msg.content.toString());
            console.log("✅ Received Blog Event:", data);
        }
    );
};
