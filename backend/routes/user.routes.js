import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getUserProfileById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/user.controller.js";

const router = express.Router();

// Full profile (own)
router.get("/profile", authMiddleware, getProfile);

// Public profile of any user (by id)
router.get("/profile/:id", authMiddleware, getUserProfileById);

// Follow / Unfollow
router.post("/follow/:id", authMiddleware, followUser);
router.delete("/follow/:id", authMiddleware, unfollowUser);

// Followers / Following lists
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);

export default router;
