import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";

const Login = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const web3 = new Web3(window.ethereum);

    const handleConnectMetaMask = async () => {
        try {
            setLoading(true);
            setError("");

            if (!window.ethereum) {
                throw new Error("MetaMask is not installed!");
            }
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const userAddress = accounts[0];

            const responseMessage = await axios.post(
                "http://localhost:5000/api/auth/message",
                { address: userAddress }
            );
            const { message: serverMessage, nonce: serverNonce } =
                responseMessage.data;

            const userSignature = await web3.eth.personal.sign(
                serverMessage,
                userAddress,
                ""
            );

            const responseVerify = await axios.post(
                "http://localhost:5000/api/auth/verify",
                {
                    address: userAddress,
                    signature: userSignature,
                    nonce: serverNonce,
                }
            );

            if (responseVerify.status === 200) {
                const userToken = responseVerify.data.token;
                localStorage.setItem("token", userToken);
                navigate("/", { replace: true });
            } else {
                throw new Error("Failed to authenticate with server.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred during authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Auth via MetaMask</h2>

            <button onClick={handleConnectMetaMask} disabled={loading}>
                {loading ? "Authenticating..." : "Connect MetaMask"}
            </button>

            {error && (
                <div style={{ color: "red" }}>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default Login;
