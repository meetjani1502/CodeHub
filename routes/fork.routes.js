import express from "express";
import { forkRepository } from "../controllers/fork.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Fork Repository
router.post("/create", auth, forkRepository);

export default router;
