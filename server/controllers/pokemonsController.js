import Pokemon from "../models/pokemonModel.js";
import { handleError } from "../utils/errorHandler.js";

export const getPokemons = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 50;

    if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
        return res.status(400).json({
            message: "Page must be a positive integer greater than 0.",
        });
    }

    const skip = (page - 1) * limit;
    try {
        const pokemons = await Pokemon.find()
            .skip(Number(skip))
            .limit(Number(limit));

        if (pokemons.length > 0) {
            res.status(200).json({
                data: pokemons,
            });
        } else {
            res.status(404).json({
                message: "No pokemons found",
            });
        }
    } catch (err) {
        handleError(err, res);
    }
};
