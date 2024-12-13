import Web3 from "web3";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const web3 = new Web3();

export const generateMessage = async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findOne({ publicAddress: address });
        if (user) {
            const message = `Authenticate using MetaMask. Your nonce is: ${user.nonce}`;
            const nonce = user.nonce;
            res.json({
                message,
                nonce,
            });
        } else {
            const nonce = Math.floor(Math.random() * 1000000).toString();
            const message = `Authenticate using MetaMask. Your nonce is: ${nonce}`;
            res.json({ message, nonce });
        }
    } catch (err) {
        console.error("Error generating message:", err);
        res.status(500).json({ error: "Error generating message" });
    }
};

export const verifySignature = async (req, res) => {
    const { address, signature, nonce } = req.body;

    try {
        const message = `Authenticate using MetaMask. Your nonce is: ${nonce}`;

        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            const token = jwt.sign({ address }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            let user = await User.findOne({ publicAddress: address });
            if (!user) {
                user = new User({
                    publicAddress: address,
                    nonce: Math.floor(Math.random() * 1000000).toString(),
                });
                await user.save();
                console.log("User saved successfully");
            } else {
                if (user.nonce !== nonce) {
                    return res.status(400).json({ error: "Invalid nonce" });
                }

                user.nonce = Math.floor(Math.random() * 1000000).toString();
                await user.save();
            }

            return res.json({ token });
        } else {
            return res.status(400).json({ error: "Invalid signature" });
        }
    } catch (err) {
        console.error("Error verifying signature:", err);
        res.status(500).json({ error: "Error verifying signature" });
    }
};
