import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createIssue,
  getAllIssues,
  getIssuesByRepository,
  getIssueById,
  closeIssue,
  reopenIssue,
} from "../controllers/issue.controller.js";

const router = express.Router();

// Create issue
router.post("/create", authMiddleware, createIssue);

// Get ALL issues (all repositories)
router.get("/all", authMiddleware, getAllIssues);

// Get issues by repository
router.get("/repository/:repositoryId", authMiddleware, getIssuesByRepository);

// Close / Reopen issue
router.put("/:id/close", authMiddleware, closeIssue);
router.put("/:id/reopen", authMiddleware, reopenIssue);

// Get single issue (keep below /all and /repository to avoid route conflicts)
router.get("/:id", authMiddleware, getIssueById);

export default router;
