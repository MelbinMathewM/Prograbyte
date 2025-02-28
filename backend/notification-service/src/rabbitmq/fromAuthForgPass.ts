import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("forgot_password", { durable: true });
    console.log("🐇 Notification Service connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
};

export const consumeQueue = async (queue: string, callback: (msg: amqp.ConsumeMessage | null) => void) => {
  if (!channel) {
    console.error("RabbitMQ Channel is not initialized");
    return;
  }
  await channel.consume(queue, callback, { noAck: true });
};

export default { connectRabbitMQ, consumeQueue };
