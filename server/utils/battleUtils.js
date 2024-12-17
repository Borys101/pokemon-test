import Pokemon from "../models/pokemonModel.js";
import { typeEffectiveness } from "../constants/typeEffectiveness.js";

export const calculateDamage = (attacker, defender) => {
    const randomFactor = Math.random();
    if (randomFactor < 0.1) return 0; // Miss

    const attack = attacker.base.Attack;
    const defense = defender.base.Defense;
    const basePower = 50;

    // CHANGE 50 TO 1
    const damage = Math.floor(
        (((2 * 50) / 5 + 2) * basePower * (attack / defense)) / 50 + 2
    );

    return Math.floor(damage * randomFactor);
};

export const chooseBalancedPokemon = async (playerPokemon) => {
    const pokemons = await Pokemon.find({ base: { $exists: true } });
    const counterTypes = getCounterTypes(playerPokemon.type);

    const effectivePokemons = pokemons.filter((pokemon) =>
        pokemon.type.some((type) => counterTypes.has(type))
    );
    const pool = effectivePokemons.length > 0 ? effectivePokemons : pokemons;

    return pool[Math.floor(Math.random() * pool.length)];
};

const getCounterTypes = (playerTypes) => {
    let counterTypes = new Set();
    playerTypes.forEach((type) => {
        if (typeEffectiveness[type]) {
            typeEffectiveness[type].forEach((counterType) =>
                counterTypes.add(counterType)
            );
        }
    });
    return counterTypes;
};
