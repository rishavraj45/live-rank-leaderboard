import {
    addPlayer,
    updateScore,
    incrementScore,
    getTopPlayers,
    getPlayerRank,
    getPlayersAround,
    removePlayer,
    getTotalPlayers
} from "../services/leaderboardService.js";
//controller receives the request, calls the service, and sends a response to the client.

import { broadcastLeaderboard } from "../socket.js";

export const createPlayer = async (req, res) => {
    try {
        const { playerId, score } = req.body;

        if (!playerId) {
            return res.status(400).json({
                message: "playerId is required"
            });
        }

        // call this redis service
        const result = await addPlayer(
            playerId,
            score || 0
        );

        await broadcastLeaderboard();

        res.status(201).json({
            success: true,
            player: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const setScore = async (req, res) => {
    try {
        const { playerId } = req.params;
        const { score } = req.body;

        if (score === undefined) {
            return res.status(400).json({
                message: "score is required"
            });
        }

        const result = await updateScore(
            playerId,
            score
        );

        await broadcastLeaderboard();

        res.json({
            success: true,
            player: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const addScore = async (req, res) => {
    try {
        const { playerId } = req.params;       // read the player ID from URL
        const { amount } = req.body;          // read the increment amount from json body

        if (amount === undefined) {
            return res.status(400).json({
                message: "amount is required"
            });
        }

        // controller doesn't directly perform redis commands. That work belongs to the service.
        //ask the service to update the score in redis
        const result = await incrementScore(
            playerId,
            amount
        );

        // broadcast the updated leaderboard to connected browsers
        await broadcastLeaderboard();

        // send the API response back to postman
        res.json({
            success: true,
            player: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// fetch the leaderboard
// export const getLeaderboard :- makes this function available to the routes file
// async :- allows us to use await for asynchronous operations
// req :- contains the incoming request details
// res :- used to send the response back to client
export const getLeaderboard = async (req, res) => {
    try {
        const limit = Number(req.query.limit ?? 10);         //reads the limit query parameter from req ( GET /api/leaderboard?limit=5 ), if no limit is provided, it defaults to 10

        // with validation middleware, invalid values like limit=500 should be rejected before reaching to controller
        // await means the controller waits for redis to return the result before continuing
        const leaderboard = await getTopPlayers(limit);


        // sends the result back as JSON
        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getRank = async (req, res) => {
    try {
        const { playerId } = req.params;

        const result = await getPlayerRank(playerId);

        if (!result) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        res.json({
            success: true,
            player: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getAroundPlayer = async (req, res) => {
    try {
        const { playerId } = req.params;

        const range = Number(req.query.range) || 2;

        const result = await getPlayersAround(
            playerId,
            range
        );

        if (!result) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        res.json({
            success: true,
            leaderboard: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const { playerId } = req.params;

        const removed = await removePlayer(playerId);

        if (!removed) {
            return res.status(404).json({
                message: "Player not found"
            });
        }

        await broadcastLeaderboard();

        res.json({
            success: true,
            message: "Player removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getPlayerCount = async (req, res) => {
    try {
        const count = await getTotalPlayers();

        res.json({
            success: true,
            totalPlayers: count
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};