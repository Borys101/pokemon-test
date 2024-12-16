import Pokemon from "../models/pokemonModel.js";

export const startBattle = async (playerPokemon) => {
    if (!playerPokemon) {
        throw new Error("Player Pokémon is not defined");
    }
    const computerPokemon = await chooseBalancedPokemon(playerPokemon);

    const battleState = {
        player: playerPokemon,
        computer: computerPokemon,
        isBattleOver: false,
        firstMove:
            playerPokemon.base.Speed >= computerPokemon.base.Speed
                ? "player"
                : "computer",
        nextTurn: async function (attacker) {
            const defender =
                attacker === "player" ? this.computer : this.player;
            const damage = calculateDamage(
                attacker === "player" ? this.player : this.computer,
                defender
            );

            const battleLog = [];
            if (damage === 0) {
                battleLog.push(
                    `${
                        attacker === "player" ? "YOU" : "COMPUTER"
                    } missed the attack!`
                );
            } else {
                defender.base.HP -= damage;
                battleLog.push(
                    `${
                        attacker === "player" ? "YOU" : "COMPUTER"
                    } attacks and deals ${damage} damage!`
                );
            }

            const isBattleOver = defender.base.HP <= 0;
            if (isBattleOver) {
                battleLog.push(
                    `${
                        attacker === "player" ? "YOU" : "COMPUTER"
                    } win the battle!`
                );
                defender.base.HP = 0;
                this.isBattleOver = true;
            }

            return {
                defender,
                battleLog,
                isBattleOver,
                updatedBattleState: this,
            };
        },
    };

    return battleState;
};

export const playerAttackLogic = (battleState) => {
    const { player, computer } = battleState;

    const damage = calculateDamage(player, computer);
    computer.HP -= damage;

    const log = `Player attacks and deals ${damage} damage!`;

    if (computer.HP <= 0) {
        return { log: `${log} Computer's Pokemon fainted!`, isOver: true };
    }

    return {
        log,
        nextTurn: "computer",
        player: player,
        computer: computer,
        isOver: false,
    };
};

const typeEffectiveness = {
    Fire: ["Water", "Rock", "Ground"],
    Grass: ["Fire", "Flying", "Bug", "Poison", "Ice"],
    Water: ["Electric", "Grass"],
    Electric: ["Ground"],
    Rock: ["Water", "Grass", "Fighting", "Ground", "Steel"],
    Ground: ["Water", "Grass", "Ice"],
    Flying: ["Electric", "Rock", "Ice"],
    Bug: ["Fire", "Flying", "Rock"],
    Poison: ["Ground", "Psychic"],
    Psychic: ["Bug", "Ghost", "Dark"],
    Dark: ["Fighting", "Bug", "Fairy"],
    Ice: ["Fire", "Rock", "Steel", "Fighting"],
    Fighting: ["Flying", "Psychic", "Fairy"],
    Steel: ["Fire", "Fighting", "Ground"],
    Fairy: ["Poison", "Steel"],
    Normal: ["Fighting"],
};

const chooseBalancedPokemon = async (playerPokemon) => {
    const pokemons = await Pokemon.find({ base: { $exists: true } });
    const playerTypes = playerPokemon.type;

    let counterTypes = new Set();
    playerTypes.forEach((type) => {
        if (typeEffectiveness[type]) {
            typeEffectiveness[type].forEach((counterType) =>
                counterTypes.add(counterType)
            );
        }
    });

    const effectivePokemons = pokemons.filter((pokemon) =>
        pokemon.type.some((type) => counterTypes.has(type))
    );

    const pool = effectivePokemons.length > 0 ? effectivePokemons : pokemons;

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
};

const calculateDamage = (attacker, defender) => {
    const randomFactor = Math.random();
    if (randomFactor < 0.1) return 0; // Miss

    const attack = attacker.base.Attack;
    const defense = defender.base.Defense;
    const basePower = 50;

    // DELETE ADDITIONALLY Math.floor()

    const damage = Math.floor(
        (((2 * 50) / 5 + 2) * basePower * (attack / defense)) / 50 + 2
    );

    return Math.floor(damage * randomFactor);
};
