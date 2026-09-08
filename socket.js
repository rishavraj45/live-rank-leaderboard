import { Server } from "socket.io";
import { getTopPlayers } from "./services/leaderboardService.js";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", async (socket) => {
        console.log(`Client connected: ${socket.id}`);

        const leaderboard = await getTopPlayers(10);

        socket.emit("leaderboard:update", leaderboard);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const broadcastLeaderboard = async () => {
    if (!io) return;

    const leaderboard = await getTopPlayers(10);

    io.emit("leaderboard:update", leaderboard);
};