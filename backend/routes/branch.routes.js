import express from "express";

import {
    createBranch,
    getBranches,
    deleteBranch,
    getBranchCommits,
    checkoutBranch,
    mergeBranch
} from "../controllers/branch.controller.js";

const router = express.Router();

// Create branch
router.post("/create", createBranch);

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

export default router;