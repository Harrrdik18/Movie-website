require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectRedis } = require("./config/redis");

const connectDatabase = require("./config/database");

async () => {
  await connectDatabase();
  await connectRedis();
};

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://movie-website-virid-three.vercel.app",
    ],
    credentials: true,
  }),
);

const userRoutes = require("./routes/userRoutes");
const omdbRoutes = require("./routes/omdbRoutes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/omdb", omdbRoutes);

app.get("/", (req, res) => {
  res.send("CineGlance API running");
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
  });
});

app.listen(process.env.PORT || 5000);
