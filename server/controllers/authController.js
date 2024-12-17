import Web3 from "web3";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { handleError } from "../utils/errorHandler.js";
import { validationResult, check } from "express-validator";

const web3 = new Web3();

export const generateMessage = async (req, res) => {
    try {
        await check("address")
            .isEthereumAddress()
            .withMessage("Invalid Ethereum address")
            .run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
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
        handleError(err, res);
    }
};

export const verifySignature = async (req, res) => {
    try {
        await check("address")
            .isEthereumAddress()
            .withMessage("Invalid Ethereum address")
            .run(req);
        await check("signature")
            .notEmpty()
            .withMessage("Signature is required")
            .run(req);
        await check("nonce")
            .notEmpty()
            .withMessage("Nonce is required")
            .isNumeric()
            .withMessage("Nonce should be a number")
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { address, signature, nonce } = req.body;
        const message = `Authenticate using MetaMask. Your nonce is: ${nonce}`;

        const recoveredAddress = web3.eth.accounts.recover(message, signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            const token = jwt.sign({ address }, process.env.JWT_SECRET, {
                expiresIn: "4h",
            });

            let user = await User.findOne({ publicAddress: address });
            if (!user) {
                user = new User({
                    publicAddress: address,
                    nonce: Math.floor(Math.random() * 1000000).toString(),
                });
                await user.save();
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
        handleError(err, res);
    }
};
