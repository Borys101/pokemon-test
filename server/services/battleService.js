import {
    calculateDamage,
    chooseBalancedPokemon,
} from "../utils/battleUtils.js";

export const startBattle = async (playerPokemon, playerAddress) => {
    if (!playerPokemon) {
        throw new Error("Player Pokémon is not defined");
    }
    const computerPokemon = await chooseBalancedPokemon(playerPokemon);

    const battleState = {
        playerAddress,
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
