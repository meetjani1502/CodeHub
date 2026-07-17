import express from "express";

import {
    createBranch,
    getBranches,
    deleteBranch,
    getBranchCommits
} from "../controllers/branch.controller.js";


const router = express.Router();


// Create branch
router.post("/create", createBranch);


// Get repository branches
router.get("/repository/:repositoryId", getBranches);
router.get(
"/branch/:branchId",
getBranchCommits
);

// Delete branch
router.delete("/:id", deleteBranch);


export default router;