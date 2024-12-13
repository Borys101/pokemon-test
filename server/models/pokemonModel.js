import { Schema, model } from "mongoose";

const PokemonSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            english: {
                type: String,
                required: true,
            },
            japanese: {
                type: String,
                required: true,
            },
            chinese: {
                type: String,
                required: true,
            },
            french: {
                type: String,
                required: true,
            },
        },
        type: {
            type: [String],
            required: true,
        },
        base: {
            HP: {
                type: Number,
                required: true,
            },
            Attack: {
                type: Number,
                required: true,
            },
            Defense: {
                type: Number,
                required: true,
            },
            "Sp. Attack": {
                type: Number,
                required: true,
            },
            "Sp. Defense": {
                type: Number,
                required: true,
            },
            Speed: {
                type: Number,
                required: true,
            },
        },
        species: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        evolution: {
            prev: [
                {
                    type: String,
                },
            ],
            next: [
                {
                    type: [String],
                },
            ],
        },
        profile: {
            height: {
                type: String,
                required: true,
            },
            weight: {
                type: String,
                required: true,
            },
            egg: {
                type: [String],
                required: true,
            },
            ability: [
                {
                    type: [String],
                    required: true,
                },
            ],
            gender: {
                type: String,
                required: true,
            },
        },
        image: {
            sprite: {
                type: String,
                required: true,
            },
            thumbnail: {
                type: String,
                required: true,
            },
            hires: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

const Pokemon = model("Pokemon", PokemonSchema);

export default Pokemon;
