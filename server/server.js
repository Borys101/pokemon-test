import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import pokemonsRoutes from "./routes/pokemonsRoutes.js";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
