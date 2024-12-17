import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./battleHistory.scss";

const BattlesHistory = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        winCount: 0,
        lossCount: 0,
        bestPokemon: "",
    });
    const [battles, setBattles] = useState([]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const playerAddress = accounts[0];
            const response = await axios.get(
                "http://localhost:5000/api/battles/battles-history",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "X-Player-Address": playerAddress,
                    },
                }
            );

            if (response.status === 200) {
                setBattles(response.data.battles);
                setStats(response.data.stats);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            } else {
                setError(response.data.message || "Failed to fetch history");
            }
        } catch (err) {
            setError("Failed to fetch history");
            if (err.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);
    return (
        <div className="battle-history">
            <h2>Battle History</h2>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}

            {!loading && !error && (
                <>
                    <div className="stats">
                        <h3>Statistics</h3>
                        <p>
                            <strong>Total Battles:</strong> {battles.length}
                        </p>
                        <p>
                            <strong>Wins:</strong> {stats.winCount}
                        </p>
                        <p>
                            <strong>Losses:</strong> {stats.lossCount}
                        </p>
                        <p>
                            <strong>Best Pokemon:</strong> {stats.bestPokemon}
                        </p>
                    </div>

                    <div className="battle-list">
                        {battles.map((battle) => (
                            <div key={battle._id} className="battle-card">
                                <div className="battle-summary">
                                    <h4>
                                        {battle.player.name.english} vs{" "}
                                        {battle.computer.name.english}
                                    </h4>
                                    <p>
                                        Winner:{" "}
                                        {battle.winner === "player"
                                            ? "You"
                                            : "Computer"}
                                    </p>
                                    <p>
                                        Battle Date:{" "}
                                        {new Date(
                                            battle.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="battle-image">
                                    <img
                                        src={battle.player.image.thumbnail}
                                        alt={battle.player.name.english}
                                    />
                                    <img
                                        src={battle.computer.image.thumbnail}
                                        alt={battle.computer.name.english}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BattlesHistory;
