import "dotenv/config";
import express from "express";
import http from "http";

import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import { initializeSocket } from "./socket.js";

const app = express();

const server = http.createServer(app);

app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({
        message: "Live Rank Leaderboard API"
    });
});

app.use("/api/leaderboard", leaderboardRoutes);

initializeSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});