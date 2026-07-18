import express from "express";

import {
    createPullRequest,
    getPullRequests,
    approvePullRequest,
    rejectPullRequest,
    mergePullRequest
} from "../controllers/pullRequest.controller.js";


const router = express.Router();


// Create PR
router.post("/create", createPullRequest);


// Get all PR
router.get("/", getPullRequests);


// Pull Request approval
router.put("/:id/approve", approvePullRequest);

// Pull Request rejection
router.put("/:id/reject", rejectPullRequest);

// Pull Request merge
router.put("/:id/merge", mergePullRequest);

export default router;