import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
app.use(cors());
app.use(express.json());
//routes
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
