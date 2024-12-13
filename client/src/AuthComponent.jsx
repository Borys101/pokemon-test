import { useState } from "react";
import Web3 from "web3";
import axios from "axios";

const AuthComponent = () => {
    const [address, setAddress] = useState("");
    const [signature, setSignature] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [nonce, setNonce] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    const web3 = new Web3(window.ethereum);

    const getAddress = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAddress(accounts[0]);
            } else {
                setError("MetaMask не установлен!");
            }
        } catch (err) {
            setError("Ошибка получения адреса MetaMask");
        }
    };

    const fetchMessage = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/message",
                {
                    address,
                }
            );
            console.log("Server message:", response.data.message);
            setMessage(response.data.message);
            setNonce(response.data.nonce);
        } catch (err) {
            console.error("Error fetching message:", err);
            setError("Failed to fetch message");
        }
    };

    const signMessage = async () => {
        try {
            console.log("Message to sign:", message);
            const signature = await web3.eth.personal.sign(
                message,
                address,
                ""
            );
            console.log("Signature:", signature);
            setSignature(signature);
            const response = await axios.post(
                "http://localhost:5000/api/auth/verify",
                {
                    address,
                    signature,
                    nonce,
                }
            );
            console.log(response);
        } catch (err) {
            console.error("Error signing message:", err);
            setError("Failed to sign message");
        }
    };

    return (
        <div>
            <h1>Авторизация через MetaMask</h1>

            {/* Кнопка для получения адреса MetaMask */}
            <button onClick={getAddress}>Подключить MetaMask</button>

            {address && (
                <div>
                    <p>Ваш адрес MetaMask: {address}</p>
                    <button onClick={fetchMessage} disabled={loading}>
                        {loading
                            ? "Загружаем сообщение..."
                            : "Получить сообщение"}
                    </button>
                </div>
            )}

            {message && (
                <div>
                    <p>{message}</p>
                    <button onClick={signMessage} disabled={loading}>
                        {loading ? "Подписываем..." : "Подписать сообщение"}
                    </button>
                </div>
            )}

            {signature && (
                <div>
                    <p>Подписанное сообщение: {signature}</p>
                </div>
            )}

            {token && (
                <div>
                    <p>Токен доступа: {token}</p>
                </div>
            )}

            {error && (
                <div style={{ color: "red" }}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default AuthComponent;
