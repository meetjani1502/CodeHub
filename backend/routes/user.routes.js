import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getUserProfileById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getMySessions,
  revokeSession,
} from "../controllers/user.controller.js";

const router = express.Router();

// Full profile (own)
router.get("/profile", authMiddleware, getProfile);

// Update own profile
router.put("/profile", authMiddleware, updateProfile);

// Public profile of any user (by id)
router.get("/profile/:id", authMiddleware, getUserProfileById);

// Follow / Unfollow
router.post("/follow/:id", authMiddleware, followUser);
router.delete("/follow/:id", authMiddleware, unfollowUser);

// Followers / Following lists (own)
router.get("/followers", authMiddleware, getFollowers);
router.get("/following", authMiddleware, getFollowing);

// Followers / Following lists (of a specific user)
router.get("/followers/:id", authMiddleware, getFollowers);
router.get("/following/:id", authMiddleware, getFollowing);

// Sessions
router.get("/sessions", authMiddleware, getMySessions);
router.put("/sessions/:id/revoke", authMiddleware, revokeSession);
export default router;
