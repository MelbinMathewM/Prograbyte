import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("forgot_password", { durable: true });
    console.log("🐇 Connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
};

export const publishToQueue = async (queue: string, message: object) => {
  if (!channel) {
    console.error("RabbitMQ Channel is not initialized");
    return;
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

export default { connectRabbitMQ, publishToQueue };
