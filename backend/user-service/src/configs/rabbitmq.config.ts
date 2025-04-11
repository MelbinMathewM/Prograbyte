import * as amqp from "amqplib";
import { env } from "./env.config";

let rabbitConnection: amqp.Connection | null = null;
let rabbitChannel: amqp.Channel | null = null;
const exchange = "user_service";

export const initializeRabbitMQ = async (): Promise<void> => {
  try {
    rabbitConnection = await amqp.connect(env.RABBITMQ_URL as string) as unknown as amqp.Connection;
    rabbitChannel = await (rabbitConnection as any).createChannel();
    await rabbitChannel?.assertExchange(exchange, "topic", { durable: true });
    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ RabbitMQ Initialization Error:", error);
    throw error;
  }
};

export const getRabbitMQ = () => ({
  connection: rabbitConnection,
  channel: rabbitChannel,
  exchange,
});

export const closeRabbitMQ = async (): Promise<void> => {
  try {
    await (rabbitChannel as any).close();
    await (rabbitConnection as any).close();
    console.log("✅ RabbitMQ Connection Closed");
  } catch (error) {
    console.error("❌ Error closing RabbitMQ connection:", error);
  }
};
