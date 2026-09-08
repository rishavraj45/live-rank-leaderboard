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

import { broadcastLeaderboard } from "../socket.js";

export const createPlayer = async (req, res) => {
    try {
        const { playerId, score } = req.body;

        if (!playerId) {
            return res.status(400).json({
                message: "playerId is required"
            });
        }

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
        const { playerId } = req.params;
        const { amount } = req.body;

        if (amount === undefined) {
            return res.status(400).json({
                message: "amount is required"
            });
        }

        const result = await incrementScore(
            playerId,
            amount
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

export const getLeaderboard = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;

        const leaderboard = await getTopPlayers(limit);

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