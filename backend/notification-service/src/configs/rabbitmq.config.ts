import * as amqp from "amqplib";
import { env } from "./env.config";

let rabbitConnection: amqp.Connection | null = null;
let rabbitChannel: amqp.Channel | null = null;
const exchange = "notification_service";

export const initializeRabbitMQ = async (): Promise<void> => {
  try {
    rabbitConnection = await amqp.connect(env.RABBITMQ_URL as string);
    rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertExchange(exchange, "topic", { durable: true });

    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("❌ RabbitMQ Initialization Error:", error);
    throw error;
  }
};

export const getRabbitMQ = (): { connection: amqp.Connection | null; channel: amqp.Channel | null; exchange: string } => ({
  connection: rabbitConnection,
  channel: rabbitChannel,
  exchange,
});

export const closeRabbitMQ = async (): Promise<void> => {
  if (rabbitChannel) {
    await rabbitChannel.close();
  }
  if (rabbitConnection) {
    await rabbitConnection.close();
  }
  console.log("✅ RabbitMQ Connection Closed");
};
