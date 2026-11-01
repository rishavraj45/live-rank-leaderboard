import { Server } from "socket.io";
import { getTopPlayers } from "./services/leaderboardService.js";

// this file creates the Socket.IO server and broadcasts leaderboard changes

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

        // when a browser connects, it receives the current leaderboard
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

    // after a score changes, the server broadcasts the new leaderboard to all connected clients
    io.emit("leaderboard:update", leaderboard);
};


/*
the differencee:-
socket.emit(...) sends to one connected client.
io.emit(...) send to every connected client.

That's why two open browser tabs can update at the same time.
 */