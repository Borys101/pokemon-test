import express from "express";
import { getPokemons } from "../controllers/pokemonsController.js";

const router = express.Router();

router.get("/get-pokemons-list", getPokemons);

export default router;
