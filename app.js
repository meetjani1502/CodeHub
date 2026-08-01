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

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://code-hub-six-iota.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS. Origin received:", JSON.stringify(origin));
      console.log("Allowed origins list:", JSON.stringify(allowedOrigins));
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// NOTE: removed app.options("*", cors()) — it crashes on Express 5 / newer
// path-to-regexp because "*" is no longer a valid bare wildcard path.
// The cors() middleware above already handles OPTIONS preflight requests.

app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodeHub Backend Running 🚀",
  });
});

app.use("/api/user", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/commits", commitRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/pullrequests", pullRequestRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/forks", forkRoutes);
app.use("/api/issues", issueRoutes);

// Server
const PORT = process.env.PORT || 5000;

prisma
  .$connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
