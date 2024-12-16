import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pokemonsRoutes from "./routes/pokemonsRoutes.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupBattleSocket } from "./controllers/battleController.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonsRoutes);

setupBattleSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
