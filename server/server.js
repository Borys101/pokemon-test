import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pokemonsRoutes from "./routes/pokemonsRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { setupBattleSocket } from "./controllers/battleController.js";

dotenv.config();

const initServer = async () => {
    try {
        const app = express();
        await connectDB();

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
        app.use("/api/battles", battleRoutes);

        setupBattleSocket(io);

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error during server initialization:", error);
        process.exit(1);
    }
};

initServer();
