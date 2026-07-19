import express from "express";

import {
  createBranch,
  getBranches,
  deleteBranch,
  getBranchCommits,
  checkoutBranch,
  mergeBranch,
  switchBranch,
  getBranchesByRepository,
} from "../controllers/branch.controller.js";

const router = express.Router();

// Create branch
router.post("/create", createBranch);

// get repository branches
router.get("/repository/:repositoryId", getBranchesByRepository);

// Checkout branch
router.post("/checkout/:branchId", checkoutBranch);

// Merge branch
router.post("/merge", mergeBranch);

// Get repository branches
router.get("/repository/:repositoryId", getBranches);

// Get commits of branch
router.get("/branch/:branchId", getBranchCommits);

// Delete branch
router.delete("/:id", deleteBranch);

// Switch Branch
router.post("/switch/:branchId", switchBranch);
export default router;
