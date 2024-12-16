import { useNavigate } from "react-router-dom";
import "./pokemonCard.scss";

const PokemonCard = ({ pokemon, isSelected, onSelect }) => {
    const navigate = useNavigate();

    const startBattle = () => {
        if (!pokemon) {
            alert("Please select a Pokemon to start the battle!");
            return;
        }
        navigate("/battle", { state: { pokemon } });
    };
    return (
        <div
            className={`pokemon-container ${isSelected ? "active" : ""}`}
            onClick={onSelect}
        >
            <div>
                <p className="pokemon-name">{pokemon?.name.english}</p>
                <div className="pokemon-type">
                    {pokemon?.type.map((el) => (
                        <p key={el}>{el}</p>
                    ))}
                </div>
            </div>
            <img
                className="pokemon-image"
                width={100}
                height={100}
                src={pokemon?.image.thumbnail}
            />
            <div className="characteristic">
                <p>HP: {pokemon?.base?.HP}</p>
                <p>Defense: {pokemon?.base?.Defense}</p>
            </div>
            <div className="characteristic">
                <p>Attack: {pokemon?.base?.Attack}</p>
                <p>Speed: {pokemon?.base?.Speed}</p>
            </div>
            <button className="start-button" onClick={startBattle}>
                Start
            </button>
        </div>
    );
};

export default PokemonCard;
