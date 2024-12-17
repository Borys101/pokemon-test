import { useEffect, useState } from "react";

const useSocket = (socket, initialPlayerPokemon) => {
    const [battleLog, setBattleLog] = useState([]);
    const [computerPokemon, setComputerPokemon] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [isBattleOver, setIsBattleOver] = useState(false);
    const [player, setPlayer] = useState(initialPlayerPokemon);
    const [error, setError] = useState(null);
    const [isAttackInProgress, setIsAttackInProgress] = useState(false);

    useEffect(() => {
        socket.on("battleStart", ({ computer: cp, firstMove }) => {
            setComputerPokemon(cp);
            setBattleLog((prevLog) => [
                ...prevLog,
                `${firstMove} starts the battle!`,
            ]);
            setIsPlayerTurn(firstMove === "YOU");
        });

        socket.on(
            "attackResult",
            ({ attacker, defenderHP, battleLog: log, isBattleOver }) => {
                setBattleLog((prevLog) => [...prevLog, ...log]);

                if (attacker === "player") {
                    setComputerPokemon((prevState) => ({
                        ...prevState,
                        base: { ...prevState.base, HP: defenderHP },
                    }));
                } else {
                    setPlayer((prevState) => ({
                        ...prevState,
                        base: { ...prevState.base, HP: defenderHP },
                    }));
                }

                setIsPlayerTurn(attacker !== "player");
                setIsBattleOver(isBattleOver);
                setIsAttackInProgress(false);
            }
        );

        socket.on("error", (errorData) => {
            setError(errorData.message);
            setIsAttackInProgress(false);
        });

        return () => {
            socket.off("battleStart");
            socket.off("attackResult");
            socket.off("error");
        };
    }, [socket]);

    const handleAttack = () => {
        if (!isPlayerTurn || isBattleOver || isAttackInProgress) return;
        setIsAttackInProgress(true);
        socket.emit("attack", { attacker: "player" });
    };

    return {
        battleLog,
        computerPokemon,
        isPlayerTurn,
        isBattleOver,
        player,
        handleAttack,
        error,
        isAttackInProgress,
    };
};

export default useSocket;
