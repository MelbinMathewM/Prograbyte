import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return stack 
    ? `[${timestamp}] ${level}: ${message} \nStack Trace: ${stack}` 
    : `[${timestamp}] ${level}: ${message}`;
});

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Handle Uncaught Exceptions & Rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: "logs/exceptions.log" })
);
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

// Optional: Add MongoDB Transport (Uncomment if needed)
// import "winston-mongodb";
// logger.add(new winston.transports.MongoDB({
//   db: "mongodb://localhost:27017/logs",
//   collection: "log_entries",
//   level: "error",
// }));

export default logger;
