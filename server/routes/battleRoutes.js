import express from "express";
import { getBattlesHistoryByUserId } from "../controllers/battleController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/battles-history", authMiddleware, getBattlesHistoryByUserId);

export default router;
