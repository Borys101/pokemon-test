import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./battleScreen.scss";

const socket = io("http://localhost:5000");

const Battle = () => {
    const location = useLocation();
    const { pokemon } = location.state || {};
    const [playerPokemon, setPlayerPokemon] = useState(
        location.state.pokemon || {}
    );

    const [battleLog, setBattleLog] = useState([]);
    const [computerPokemon, setComputerPokemon] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [isBattleOver, setIsBattleOver] = useState(false);

    console.log(playerPokemon, computerPokemon);

    useEffect(() => {
        if (!pokemon) return;

        socket.emit("startBattle", { playerPokemon: pokemon });

        socket.on("battleStart", ({ computer: cp, firstMove }) => {
            setComputerPokemon(cp);
            setBattleLog((prevLog) => [
                ...prevLog,
                `${firstMove} start the battle!`,
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
                    setPlayerPokemon((prevState) => ({
                        ...prevState,
                        base: { ...prevState.base, HP: defenderHP },
                    }));
                }
                setIsPlayerTurn(attacker !== "player");
                setIsBattleOver(isBattleOver);
            }
        );

        return () => {
            socket.off("battleStart");
            socket.off("attackResult");
        };
    }, [pokemon]);

    const handleAttack = () => {
        if (!isPlayerTurn || isBattleOver) return;
        socket.emit("attack", { attacker: "player" });
    };

    return (
        <div className="battle-container">
            <div className="pokemons-info">
                <div
                    className={`pokemon-card player ${
                        isPlayerTurn && computerPokemon ? "extra-border" : ""
                    }`}
                >
                    <h3>You</h3>
                    <p>{playerPokemon?.name.english}</p>
                    <p>HP: {playerPokemon?.base?.HP}</p>
                    <img
                        src={playerPokemon?.image.hires}
                        alt={playerPokemon?.name.english}
                    />
                    <div className="characteristic">
                        <p>Attack: {playerPokemon?.base.Attack}</p>
                        <p>Defense: {playerPokemon?.base.Defense}</p>
                        <p>Speed: {playerPokemon?.base.Speed}</p>
                    </div>
                </div>
                <div
                    className={`pokemon-card computer ${
                        !isPlayerTurn && computerPokemon ? "extra-border" : ""
                    }`}
                >
                    <h3>Computer</h3>
                    {computerPokemon ? (
                        <>
                            <p>{computerPokemon?.name.english}</p>
                            <p>HP: {computerPokemon?.base?.HP}</p>
                            <img
                                src={computerPokemon?.image.hires}
                                alt={computerPokemon?.name.english}
                            />
                            <div className="characteristic">
                                <p>Attack: {computerPokemon?.base.Attack}</p>
                                <p>Defense: {computerPokemon?.base.Defense}</p>
                                <p>Speed: {computerPokemon?.base.Speed}</p>
                            </div>
                        </>
                    ) : (
                        <p>Waiting...</p>
                    )}
                </div>
            </div>
            <div className="battle-log">
                <h3>Battle Log</h3>
                <ul>
                    {battleLog.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
                {isBattleOver && <p>Battle is over!</p>}
            </div>
            {!isBattleOver && (
                <button
                    disabled={!isPlayerTurn}
                    className="attack-button"
                    onClick={handleAttack}
                >
                    Attack
                </button>
            )}
        </div>
    );
};

export default Battle;
