import amqp from "amqplib";
import Tutor from "../models/tutorModel";

// RabbitMQ Configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE = "course_service";
const QUEUE = "tutor.registered";

// RabbitMQ Consumer Function
export async function startRabbitMQConsumer() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE, "topic", { durable: true });
        await channel.assertQueue(QUEUE, { durable: true });
        await channel.bindQueue(QUEUE, EXCHANGE, "tutor.registered");

        console.log(`✅ Listening for RabbitMQ messages on queue: ${QUEUE}`);

        channel.consume(QUEUE, async (msg) => {
            if (msg) {
                const tutorData = JSON.parse(msg.content.toString());
                console.log("📥 Received tutor registration:", tutorData);

                // Store tutor data in MongoDB
                try {
                    await Tutor.create(tutorData);
                    console.log("✅ Tutor saved to database");
                } catch (error) {
                    console.error("❌ Error saving tutor:", error);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ Consumer Error:", error);
    }
}