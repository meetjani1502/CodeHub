import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"; // or ../middleware/... if that's your folder

import {
  createRepository,
  getRepositories,
  getRepositoryById,
  updateRepository,
  deleteRepository,
  starRepository,
  removeStar,
} from "../controllers/repository.controller.js";

const router = express.Router();

// create Repository

router.post("/create", authMiddleware, createRepository);

// Get All Repository

router.get("/", authMiddleware, getRepositories);

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

export default router;
