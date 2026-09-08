import express from "express";

import {
    createPlayer,
    setScore,
    addScore,
    getLeaderboard,
    getRank,
    getAroundPlayer,
    deletePlayer,
    getPlayerCount
} from "../controllers/leaderboardController.js";

const router = express.Router();

router.post("/players", createPlayer);

router.put("/players/:playerId/score", setScore);

router.patch("/players/:playerId/score", addScore);

router.get("/", getLeaderboard);

router.get("/players/:playerId/rank", getRank);

router.get("/players/:playerId/around", getAroundPlayer);

router.delete("/players/:playerId", deletePlayer);

router.get("/stats/count", getPlayerCount);

export default router;