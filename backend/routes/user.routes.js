import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userRoutes from "../routes/auth.routes.js";
const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });
});

export default router;