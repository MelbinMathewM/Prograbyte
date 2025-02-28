import amqplib from "amqplib";

const RABBITMQ_URL = "amqp://localhost";

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(RABBITMQ_URL);
        console.log("✅ RabbitMQ Connected");
        return connection.createChannel();
    } catch (err) {
        console.error("❌ RabbitMQ Connection Error:", err);
        process.exit(1);
    }
};

export default connectRabbitMQ;
