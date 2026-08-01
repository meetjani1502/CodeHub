import express from "express";

import {
  createCommit,
  getAllCommits,
  getCommits,
  getCommit,
  getCommitFiles,
  restoreCommit,
  getCommitDiff,
  getBranchCommits,
  getCommitsByRepository,
  getCommitDetail,
  getRepositoryTimeline,
} from "../controllers/commit.controller.js";

const router = express.Router();

// Create commit
router.post("/", createCommit);

// Get ALL commits (all repositories) ⭐ keep this at top
router.get("/all", getAllCommits);

// Repository Time Machine — full file state at each commit
router.get("/timeline/:repositoryId", getRepositoryTimeline);

// Get repository commits
router.get("/repository/:repositoryId", getCommitsByRepository);

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

router.get("/:id", getCommitDetail);

export default router;
