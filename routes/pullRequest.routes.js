import express from "express";

import {
  createPullRequest,
  getAllPullRequests,
  getPullRequests,
  getPullRequestById,
  approvePullRequest,
  rejectPullRequest,
  mergePullRequest,
  getPullRequestDiff,
} from "../controllers/pullRequest.controller.js";

const router = express.Router();

// CREATE PR
router.post("/create", createPullRequest);

// GET ALL PR (ALL REPOSITORIES)
router.get("/all", getAllPullRequests);

// GET ALL PR BY REPOSITORY
router.get("/repository/:repositoryId", getPullRequests);

// GET PR DIFF
router.get("/diff/:id", getPullRequestDiff);

// GET SINGLE PR
router.get("/:id", getPullRequestById);

// APPROVE PR
router.put("/:id/approve", approvePullRequest);

// REJECT PR
router.put("/:id/reject", rejectPullRequest);

// MERGE PR
router.put("/:id/merge", mergePullRequest);

export default router;
