import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import BattleScreen from "../../components/battleScreen/BattleScreen";
import "./battle.scss";

const BattlePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pokemon } = location.state || {};

    const [battleStarted, setBattleStarted] = useState(false);

    const socket = io("http://localhost:5000", {
        transports: ["websocket"],
        auth: {
            token: localStorage.getItem("token"),
        },
    });

    const getMetamaskUserId = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return accounts[0];
    };

    useEffect(() => {
        if (!pokemon) {
            navigate("/", { replace: true });
            return;
        }

        const startBattle = async () => {
            const playerAddress = await getMetamaskUserId();
            socket.emit("startBattle", {
                playerPokemon: pokemon,
                playerAddress,
            });
            setBattleStarted(true);
        };

        startBattle();

        return () => {
            socket.off("battleStart");
            socket.off("attackResult");
        };
    }, [navigate, pokemon, socket]);

    if (!pokemon) {
        return <div>Loading...</div>;
    }

    return (
        <div className="battle-container">
            {battleStarted && (
                <BattleScreen playerPokemon={pokemon} socket={socket} />
            )}
        </div>
    );
};

export default BattlePage;
