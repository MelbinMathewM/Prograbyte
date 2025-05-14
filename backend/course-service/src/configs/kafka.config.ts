import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "course_service",
  brokers: ["localhost:9092"],
});

export const KAFKA_TOPICS = {
    COURSE_EVENTS: "course-events",
    USER_EVENTS: "user-events",
  };
  
