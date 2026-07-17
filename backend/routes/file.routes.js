import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
    createFile,
    getFiles,
    getFile,
    updateFile,
    deleteFile
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createFile);

router.get("/repository/:repositoryId", authMiddleware, getFiles);

router.get("/:id", authMiddleware, getFile);

router.put("/:id", authMiddleware, updateFile);

router.delete("/:id", authMiddleware, deleteFile);

export default router;