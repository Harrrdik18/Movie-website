// const winston = require("winston");

// const logger = winston.createLogger({
//   level: "http",
//   format: winston.format.combine(
//     winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     winston.format.errors({ stack: true }),
//     winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
//       let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
//       if (stack) log += `\n${stack}`;
//       if (Object.keys(meta).length) log += ` ${JSON.stringify(meta)}`;
//       return log;
//     }),
//   ),
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         winston.format.printf(({ timestamp, level, message, stack }) => {
//           let log = `${timestamp} [${level}] ${message}`;
//           if (stack) log += `\n${stack}`;
//           return log;
//         }),
//       ),
//     }),
//     new winston.transports.File({ filename: "logs/error.log", level: "error" }),
//     new winston.transports.File({ filename: "logs/combined.log" }),
//   ],
// });

// module.exports = logger;

const logger = {
  info: (...args) => console.log("[INFO]", ...args),
  error: (...args) => console.error("[ERROR]", ...args),
  warn: (...args) => console.warn("[WARN]", ...args),
  http: (...args) => console.log("[HTTP]", ...args),
};

module.exports = logger;
