import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import PokemonCard from "../../components/pokemonCard/PokemonCard";
import "./home.scss";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const Home = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPokemons = async (currentPage) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://pokemon-test-backend.onrender.com/api/pokemons/get-pokemons-list?page=${currentPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.status === 200) {
                setPokemons((prevPokemons) => [
                    ...prevPokemons,
                    ...response.data.data,
                ]);
                setHasMore(response.data.data.length === 50);
            } else if (response.status === 400) {
                setError(response.data.message);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            } else {
                setError(response.data.message || "Internal server error");
            }
        } catch (err) {
            setError("Failed to fetch pokemons");
            if (err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const selectPokemon = (pokemon) => {
        setSelectedPokemon(pokemon === selectedPokemon ? null : pokemon);
    };

    const handleScroll = () => {
        const scrollPosition =
            window.innerHeight + document.documentElement.scrollTop;
        const maxScroll = document.documentElement.offsetHeight;

        if (scrollPosition >= maxScroll - 900 && hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const debouncedHandleScroll = useCallback(_.debounce(handleScroll, 150), [
        hasMore,
        loading,
    ]);

    useEffect(() => {
        fetchPokemons(page);
    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", debouncedHandleScroll);
        return () => {
            debouncedHandleScroll.cancel();
            window.removeEventListener("scroll", debouncedHandleScroll);
        };
    }, [debouncedHandleScroll]);

    return (
        <div className="list-container">
            {pokemons.length > 0 &&
                pokemons.map((el) => (
                    <PokemonCard
                        key={el.id}
                        pokemon={el}
                        isSelected={selectedPokemon === el}
                        onSelect={() => selectPokemon(el)}
                    />
                ))}
            {loading && <h4 className="loading">Loading...</h4>}
            {!hasMore && <p className="end-message">No more pokemons</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Home;
