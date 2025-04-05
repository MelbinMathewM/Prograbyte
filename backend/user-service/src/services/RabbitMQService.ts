import amqp from "amqplib";
import { env } from "../configs/env.config";

class RabbitMQService {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    private readonly exchange = "user_service";

    async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(env.RABBITMQ_URL as string);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchange, "topic", { durable: true });
            console.log("✅ Connected to RabbitMQ (User Service)");
        } catch (error) {
            console.error("❌ RabbitMQ Connection Error:", error);
        }
    }

    async publishMessage(routingKey: string, message: object): Promise<void> {
        if (!this.channel) {
            console.error("RabbitMQ channel not initialized");
            return;
        }

        try {
            this.channel.publish(
                this.exchange,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );
            console.log(`📢 Message sent to ${routingKey}:`, message);
        } catch (error) {
            console.error("❌ RabbitMQ Publish Error:", error);
        }
    }

    async consumeMessages(queue: string, onMessage: (msg: amqp.ConsumeMessage | null) => void): Promise<void> {
        if (!this.channel) {
            console.error("RabbitMQ channel not initialized");
            return;
        }

        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, this.exchange, queue);

        console.log(`👂 Listening for messages on queue: ${queue}`);
        this.channel.consume(queue, (msg) => {
            if (msg) {
                onMessage(msg);
                this.channel!.ack(msg);
            }
        });
    }

    async closeRabbitMQ () {
        await this.channel?.close();
        await this.connection?.close();
        console.log("✅ RabbitMQ Connection Closed (User Service)");
      };
}

export const rabbitMQService = new RabbitMQService();
