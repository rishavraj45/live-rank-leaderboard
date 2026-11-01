import "dotenv/config";    //loads values from .env
import express from "express";
import http from "http";

import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import { initializeSocket } from "./socket.js";

const app = express();       //creates express app that handles http requests

const server = http.createServer(app);       //creates the underlying http server

app.use(express.json());           //express.json() lets express read JSON request bodies, like { "amount" : 100 }

app.use(express.static("public"));       //serves the leaderboard webpage from the public folder

app.get("/", (req, res) => {
    res.json({
        message: "Live Rank Leaderboard API"
    });
});

app.use("/api/leaderboard", leaderboardRoutes);     //sends leaderboard api requests to routes file

initializeSocket(server);            //attaches socket.io to the same http server

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});              // server.listen() starts the server. We didn't use app.listen() because socket.io is attached to HTTP server, so we used server.listen()