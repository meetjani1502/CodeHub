import express from "express";

import {
  createCommit,
  getCommits,
  getCommit,
  getCommitFiles,
  restoreCommit,
  getCommitDiff,
  getBranchCommits,
} from "../controllers/commit.controller.js";

const router = express.Router();

// Create commit
router.post("/", createCommit);

// Get commits by branch  ⭐ keep this before /:repositoryId
router.get("/branch/:branchId", getBranchCommits);

// Get single commit
router.get("/single/:id", getCommit);

// Get commit files
router.get("/files/:commitId", getCommitFiles);

// Restore commit
router.post("/restore/:commitId", restoreCommit);

// Commit diff
router.get("/diff/:oldCommitId/:newCommitId", getCommitDiff);

// Get all commits of repository
router.get("/:repositoryId", getCommits);

export default router;
