import useSocket from "../../hooks/useSocket";
import { useState } from "react";
import "./battleScreen.scss";

const BattleScreen = ({ playerPokemon, socket }) => {
    const {
        battleLog,
        computerPokemon,
        isPlayerTurn,
        isBattleOver,
        player,
        handleAttack,
        error,
    } = useSocket(socket, playerPokemon);

    const [isAttacking, setIsAttacking] = useState(false);

    const handleAttackClick = async () => {
        if (isAttacking || !isPlayerTurn || isBattleOver) return;
        setIsAttacking(true);
        try {
            await handleAttack();
        } finally {
            setIsAttacking(false);
        }
    };

    return (
        <div className="battle-screen">
            {error && <div className="error-message">{error}</div>}
            <div className="pokemons-info">
                <div
                    className={`pokemon-card player ${
                        isPlayerTurn && computerPokemon ? "extra-border" : ""
                    }`}
                >
                    <h3>You</h3>
                    <p>{player?.name.english}</p>
                    <p>HP: {player?.base?.HP}</p>
                    <img src={player?.image.hires} alt={player?.name.english} />
                    <div className="characteristic">
                        <p>Attack: {player?.base.Attack}</p>
                        <p>Defense: {player?.base.Defense}</p>
                        <p>Speed: {player?.base.Speed}</p>
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
            </div>
            {!isBattleOver && (
                <button
                    disabled={!isPlayerTurn || isAttacking}
                    className="attack-button"
                    onClick={handleAttackClick}
                >
                    {isAttacking ? "Attacking..." : "Attack"}
                </button>
            )}
        </div>
    );
};

export default BattleScreen;
