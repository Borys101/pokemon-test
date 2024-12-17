import { Schema, model } from "mongoose";

const BattleSchema = new Schema(
    {
        playerAddress: {
            type: String,
            required: true,
        },
        player: {
            type: Object,
            required: true,
        },
        computer: {
            type: Object,
            required: true,
        },
        winner: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const BattleModel = model("Battle", BattleSchema);
export default BattleModel;
