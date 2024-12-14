import axios from "axios";
import { useEffect, useState } from "react";
import PokemonCard from "../../components/pokemonCard/PokemonCard";
import "./home.scss";

const Home = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const fetchPokemons = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:5000/api/pokemons/get-pokemons-list"
            );
            switch (response.status) {
                case 200:
                    setPokemons(response.data.pokemons);
                    break;
                case 404:
                    setError("Pokemons not found");
                    break;
                default:
                    setError("Internal server error");
                    break;
            }
        } catch (err) {
            setError("Failed to fetch pokemons");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectPokemon = (pokemon) => {
        setSelectedPokemon(pokemon === selectedPokemon ? null : pokemon);
    };

    useEffect(() => {
        fetchPokemons();
    }, []);

    return (
        <div className="list-container">
            {!loading &&
                !error &&
                pokemons.length > 0 &&
                pokemons?.map((el) => (
                    <PokemonCard
                        key={el.id}
                        pokemon={el}
                        isSelected={selectedPokemon === el}
                        onSelect={() => selectPokemon(el)}
                    />
                ))}
        </div>
    );
};

export default Home;
