import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        publicAddress: {
            type: String,
            required: true,
        },
        nonce: {
            type: Number,
            required: true,
            default: () => Math.floor(Math.random() * 1000000),
        },
        selectedPokemon: String,
    },
    { timestamps: true }
);

const userModel = model("User", UserSchema);
export default userModel;
