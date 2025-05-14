import { kafka } from "@/configs/kafka.config";
import { Consumer, EachMessagePayload, Producer, Message } from "kafkajs";

let producer: Producer;
let consumer: Consumer;

export const courseProducer = async () => {
    console.log('hiid')
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka producer connected");
};

export const sendKafkaMessage = async (
    topic: string,
    message: Message
) => {
    if (!producer) {
        throw new Error("Kafka producer not initialized. Call initProducer first.");
    }

    await producer.send({
        topic,
        messages: [message],
    });
};

export const initConsumer = async (
    groupId: string,
    topic: string,
    handler: (payload: EachMessagePayload) => Promise<void>
) => {
    consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async (payload) => {
            try {
                await handler(payload);
            } catch (error) {
                console.error("❌ Error processing Kafka message:", error);
            }
        },
    });

    console.log(`✅ Kafka consumer running on topic "${topic}"`);
};