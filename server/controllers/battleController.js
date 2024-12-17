import BattleModel from "../models/battleModel.js";
import { verifyToken } from "../services/authService.js";
import { startBattle } from "../services/battleService.js";
import { handleError } from "../utils/errorHandler.js";

const handleAttackResult = async (battleState, attacker, socket) => {
    const result = await battleState.nextTurn(attacker);
    socket.data.battleState = result.updatedBattleState;

    socket.emit("attackResult", {
        attacker,
        defenderHP: result.defender.base.HP,
        battleLog: result.battleLog,
        isBattleOver: result.isBattleOver,
    });

    return result;
};

export const setupBattleSocket = (io) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication token is required"));
        }

        try {
            const decoded = await verifyToken(token);
            socket.data.playerAddress = decoded.address;
            return next();
        } catch (error) {
            console.error("Authentication failed:", error.message);
            return next(new Error("Authentication failed"));
        }
    });
    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        socket.on("startBattle", async ({ playerPokemon, playerAddress }) => {
            if (!playerPokemon || !playerPokemon.name || !playerAddress) {
                socket.emit("error", { message: "Invalid data provided." });
                return;
            }
            try {
                const battleState = await startBattle(
                    playerPokemon,
                    playerAddress
                );

                const { computer, firstMove } = battleState;

                socket.emit("battleStart", {
                    computer,
                    firstMove: firstMove === "computer" ? "COMPUTER" : "YOU",
                });
                if (firstMove === "computer") {
                    setTimeout(async () => {
                        const computerResult = await handleAttackResult(
                            battleState,
                            "computer",
                            socket
                        );

                        socket.data.battleState =
                            computerResult.updatedBattleState;

                        if (computerResult.isBattleOver) {
                            saveBattleToDatabase(socket);
                        }
                    }, 2000);
                } else {
                    socket.data.battleState = battleState;
                }
            } catch (error) {
                console.error("Error starting battle:", error);
                socket.emit("error", { message: "Error starting battle." });
            }
        });

        socket.on("attack", async ({ attacker }) => {
            if (!attacker || !["player", "computer"].includes(attacker)) {
                socket.emit("error", { message: "Invalid attacker provided." });
                return;
            }
            try {
                const battleState = socket.data.battleState;

                if (!battleState || battleState.isBattleOver) {
                    socket.emit("error", { message: "Battle already over." });
                    return;
                }

                const result = await handleAttackResult(
                    battleState,
                    attacker,
                    socket
                );

                if (!result.isBattleOver) {
                    setTimeout(async () => {
                        const computerResult = await handleAttackResult(
                            battleState,
                            "computer",
                            socket
                        );

                        socket.data.battleState =
                            computerResult.updatedBattleState;

                        if (computerResult.isBattleOver) {
                            saveBattleToDatabase(socket);
                        }
                    }, 2000);
                } else {
                    socket.data.battleState = result.updatedBattleState;
                    saveBattleToDatabase(socket);
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

const saveBattleToDatabase = async (socket) => {
    const battleState = socket.data.battleState;
    const playerAddress = socket.data.battleState.playerAddress;

    try {
        const winner = battleState.player.base.HP > 0 ? "player" : "computer";

        const battle = new BattleModel({
            playerAddress,
            player: battleState.player,
            computer: battleState.computer,
            winner,
        });

        await battle.save();
    } catch (error) {
        console.error("Error saving battle to database:", error);
    }
};

export const getBattlesHistoryByUserId = async (req, res) => {
    try {
        const playerAddress = req.headers["x-player-address"];
        if (!playerAddress) {
            return res.status(400).json({
                message: "Player address is required",
            });
        }
        const battles = await BattleModel.find({ playerAddress }).sort({
            createdAt: -1,
        });

        const winCount = battles.filter(
            (battle) => battle.winner === "player"
        ).length;
        const lossCount = battles.filter(
            (battle) => battle.winner === "computer"
        ).length;

        const bestPokemon = battles.reduce((best, battle) => {
            const playerPokemon = battle.player;
            if (!best[playerPokemon.name.english]) {
                best[playerPokemon.name.english] = { wins: 0, losses: 0 };
            }
            if (battle.winner === "player") {
                best[playerPokemon.name.english].wins++;
            } else {
                best[playerPokemon.name.english].losses++;
            }
            return best;
        }, {});

        const bestPokemonName = Object.entries(bestPokemon).reduce(
            (best, [name, stats]) => {
                if (!best || stats.wins > best.stats.wins) {
                    return { name, stats };
                }
                return best;
            },
            null
        )?.name;

        res.status(200).json({
            battles,
            stats: {
                winCount,
                lossCount,
                bestPokemon: bestPokemonName,
            },
        });
    } catch (err) {
        handleError(err, res);
    }
};
