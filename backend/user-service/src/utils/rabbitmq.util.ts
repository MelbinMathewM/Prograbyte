import { getRabbitMQ } from "@/configs/rabbitmq.config";

export const publishMessage = (routingKey: string, message: object) => {
    const { channel, exchange } = getRabbitMQ();

    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized");
        return;
    }

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );

    console.log(`📤 Published message to ${routingKey}:`, message);
};

export const consumeMessages = async (
    queue: string,
    exchangeName: string,
    routingKey: string,
    onMessage: (msg: any) => void
) => {
    const { channel } = getRabbitMQ();

    if (!channel) {
        console.error("❌ RabbitMQ channel is not initialized");
        return;
    }

    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchangeName, routingKey);

    console.log(`👂 Consuming messages from queue: ${queue}`);

    channel.consume(queue, (msg) => {
        if (msg) {
            onMessage(msg);
            channel.ack(msg);
        }
    });
};
