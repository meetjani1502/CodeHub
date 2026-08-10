import express from "express";
import {
  addStar,
  removeStar,
  getStarCount,
  isStarred,
} from "../controllers/star.controller.js";

import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add Star
router.post("/add", auth, addStar);

// Remove Star
router.delete("/remove", auth, removeStar);

// Get Total Stars
router.get("/count/:repositoryId", getStarCount);

// Check if logged-in user has starred
router.get("/check/:repositoryId", auth, isStarred);

export default router;
