import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createRepository,
  getRepositories,
  getAllRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
  starRepository,
  removeStar,
  forkRepository,
} from "../controllers/repository.controller.js";

const router = express.Router();

// create Repository
router.post("/create", authMiddleware, createRepository);

// Get All Repository (own)
router.get("/", authMiddleware, getRepositories);

// Explore - all repositories (other users)
router.get("/explore/all", authMiddleware, getAllRepositories);

// GET SINGLE REPOSITORY
router.get("/:id", authMiddleware, getRepositoryById);

// UPDATE REPOSITORY
router.put("/:id", authMiddleware, updateRepository);

// DELETE REPOSITORY
router.delete("/:id", authMiddleware, deleteRepository);

// star Repository
router.post("/:id/star", authMiddleware, starRepository);

// delete started Repository
router.delete("/:id/star", authMiddleware, removeStar);

// fork Repository
router.post("/:id/fork", authMiddleware, forkRepository);

export default router;
