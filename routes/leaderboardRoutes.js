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
//route file decides which controller function should handle each api request

const router = express.Router();

router.post("/players", createPlayer);     //create a player

router.put("/players/:playerId/score", setScore);    //set the exact score

router.patch("/players/:playerId/score", addScore);     //increment the score

router.get("/", getLeaderboard);         //get the leaderboard

router.get("/players/:playerId/rank", getRank);          //get one player's rank

router.get("/players/:playerId/around", getAroundPlayer);               //get nearby players

router.delete("/players/:playerId", deletePlayer);             //delete a player

router.get("/stats/count", getPlayerCount);              //get total players

export default router;