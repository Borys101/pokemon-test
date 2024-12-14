import "./pokemonCard.scss";

const PokemonCard = ({ pokemon, isSelected, onSelect }) => {
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
            <button className="start-button">Start</button>
        </div>
    );
};

export default PokemonCard;
