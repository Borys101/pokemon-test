import { startBattle } from "../services/battleService.js";

export const setupBattleSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        socket.on("startBattle", async ({ playerPokemon }) => {
            const battleState = await startBattle(playerPokemon);

            const { computer, firstMove } = battleState;

            const updatedFirstMove =
                firstMove === "computer" ? firstMove.toUpperCase() : "YOU";

            socket.emit("battleStart", {
                computer,
                firstMove: updatedFirstMove,
            });
            if (firstMove === "computer") {
                setTimeout(async () => {
                    const computerResult = await battleState.nextTurn(
                        "computer"
                    );

                    socket.emit("attackResult", {
                        attacker: "computer",
                        defenderHP: computerResult.defender.base.HP,
                        battleLog: computerResult.battleLog,
                        isBattleOver: computerResult.isBattleOver,
                    });

                    socket.data.battleState = computerResult.updatedBattleState;
                }, 2000);
            } else {
                socket.data.battleState = battleState;
            }
        });

        socket.on("attack", async ({ attacker }) => {
            try {
                const battleState = socket.data.battleState;

                if (!battleState || battleState.isBattleOver) {
                    socket.emit("error", { message: "Battle already over." });
                    return;
                }

                const result = await battleState.nextTurn(attacker);
                socket.data.battleState = result.updatedBattleState;

                socket.emit("attackResult", {
                    attacker,
                    defenderHP: result.defender.base.HP,
                    battleLog: result.battleLog,
                    isBattleOver: result.isBattleOver,
                });

                if (!result.isBattleOver) {
                    setTimeout(async () => {
                        const computerResult = await battleState.nextTurn(
                            "computer"
                        );

                        socket.emit("attackResult", {
                            attacker: "computer",
                            defenderHP: computerResult.defender.base.HP,
                            battleLog: computerResult.battleLog,
                            isBattleOver: computerResult.isBattleOver,
                        });

                        socket.data.battleState =
                            computerResult.updatedBattleState;
                    }, 2000);
                } else {
                    socket.data.battleState = result.updatedBattleState;
                }
            } catch (error) {
                console.error("Error during attack:", error);
                socket.emit("error", { message: "Attack failed", error });
            }
        });

        socket.on("disconnect", () => {
            console.log("Player disconnected:", socket.id);
        });
    });
};
