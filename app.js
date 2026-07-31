import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import prisma from "./config/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import fileRoutes from "./routes/file.routes.js";
import repositoryRoutes from "./routes/repository.routes.js";
import commitRoutes from "./routes/commit.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import pullRequestRoutes from "./routes/pullRequest.routes.js";
import starRoutes from "./routes/star.routes.js";
import forkRoutes from "./routes/fork.routes.js";
import issueRoutes from "./routes/issue.routes.js";

dotenv.config();

const app = express();

// --------------------
// CORS Configuration
// --------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://code-j8u630wkf-meet-s-projects10.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("CORS blocked"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --------------------
// Middleware
// --------------------

app.use(cookieParser());

app.use(express.json());

// --------------------
// Routes
// --------------------

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/repositories", repositoryRoutes);

app.use("/api/commits", commitRoutes);

app.use("/api/branches", branchRoutes);

app.use("/api/pullrequests", pullRequestRoutes);

app.use("/api/stars", starRoutes);

app.use("/api/forks", forkRoutes);

app.use("/api/issues", issueRoutes);

// --------------------
// Health Check
// --------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodeHub Backend Running 🚀",
  });
});

// --------------------
// Error Handler
// --------------------

app.use((err, req, res, next) => {
  console.log("SERVER ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// --------------------
// Database + Server
// --------------------

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Database connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.log("Database connection failed ❌", error.message);

    process.exit(1);
  }
}

startServer();
