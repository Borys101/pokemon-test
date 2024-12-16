import { handleBattle } from "../controllers/battle.js";

export const setupWebSocket = (wss) => {
    wss.on("connection", (ws) => {
        console.log("New client connected");

        ws.on("message", (message) => handleBattle(ws, message));

        ws.on("close", () => console.log("Client disconnected"));
    });
};