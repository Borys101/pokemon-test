import express from "express";
import { getPokemons } from "../controllers/pokemonsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-pokemons-list", authMiddleware, getPokemons);

export default router;
