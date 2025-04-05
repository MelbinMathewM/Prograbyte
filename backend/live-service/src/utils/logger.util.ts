import winston from "winston";

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
  ],
});

// Handle Uncaught Exceptions & Rejections
logger.exceptions.handle(
  new winston.transports.Console({ format: combine(colorize(), logFormat) })
);

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

export default logger;
