import { initConsumer } from "@/utils/kafka.util";
import { KAFKA_TOPICS } from "@/configs/kafka.config";
import { WalletController } from "@/controllers/implementations/wallet.controller";

export const courseEventConsumer = async () => {
  await initConsumer("user-service-group", KAFKA_TOPICS.COURSE_EVENTS, async ({ message }) => {
    const { eventType, data } = JSON.parse(message.value?.toString() || "{}");

    switch (eventType) {
      case "course.purchased":
        console.log("Processing course.purchased event", data);
        // await walletService.handleCoursePurchase(data);
        break;

      case "course.removed":
        console.log("Processing course.removed event", data);
        // await walletService.handleCourseRefund(data);
        break;

      default:
        console.warn("Unhandled Kafka event type:", eventType);
    }
  });
};
