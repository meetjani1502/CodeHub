import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createFile,
  getFiles,
  getFile,
  updateFile,
  deleteFile,
  getFileById,
  getFilesByBranch,
} from "../controllers/file.controller.js";

const router = express.Router();

// Create file
router.post("/create", authMiddleware, createFile);

// all repository files
router.get("/repository/:repositoryId", getFiles);

// Get repository files
router.get("/repository/:repositoryId", authMiddleware, getFiles);

// branch wise files
router.get("/repository/:repositoryId/branch/:branch", getFilesByBranch);

// Get single file
router.get("/:id", authMiddleware, getFile);

// Update file
router.put("/:id", authMiddleware, updateFile);

// Delete file
router.delete("/:id", authMiddleware, deleteFile);

// Get file by ID
router.get("/file/:id", authMiddleware, getFileById);

export default router;
