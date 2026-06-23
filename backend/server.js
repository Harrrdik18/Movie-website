require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { connectRedis } = require("./config/redis");
const ErrorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");

const connectDatabase = require("./config/database");

(async () => {
  try {
    await connectDatabase();
    // await connectRedis();
    logger.info("Database and Redis connected successfully");
  } catch (error) {
    logger.error("Error connecting to database or Redis:", error);
    process.exit(1);
  }
})();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://movie-website-virid-three.vercel.app",
      "https://movie-website-w6jv.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(morgan("dev", { stream: { write: (msg) => logger.http(msg.trim()) } }));

const userRoutes = require("./routes/userRoutes");
const omdbRoutes = require("./routes/omdbRoutes");
const movieRoutes = require("./routes/movieRoutes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/omdb", omdbRoutes);
app.use("/api/v1/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("CineGlance API running");
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid ${err.path}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for ${field}. This ${field} already exists.`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  if (statusCode >= 500) {
    logger.error(`${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, err);
  } else {
    logger.warn(`${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
});

app.listen(process.env.PORT || 5000);
