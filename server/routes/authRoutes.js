import express from "express";
import {
    generateMessage,
    verifySignature,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/message", generateMessage);

router.post("/verify", verifySignature);

export default router;
