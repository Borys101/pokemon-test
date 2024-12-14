import Pokemon from "../models/pokemonModel.js";

export const getPokemons = async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        if (pokemons.length > 0) {
            res.status(200).json({
                pokemons,
            });
        } else {
            res.status(404).json({
                message: "No pokemons found",
            });
        }
    } catch (err) {
        console.error("Error generating message:", err);
        res.status(500).json({ error: "Error generating message" });
    }
};
