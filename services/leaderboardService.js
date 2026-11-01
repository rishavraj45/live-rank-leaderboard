// this file contains the leaderboard's main logic. It uses redis sorted sets.
// A redis sorted set stores unique members with numeric scores and keeps them ordered by score.

import redis from "../config/redis.js";

const LEADERBOARD_KEY = "leaderboard";        //leaderboard is the actual redis key name. Redis uses this name to identify the data structure. 

export const addPlayer = async (playerId, score = 0) => {
    // it stores "playerId" in the redis sorted set named "leaderboard", with a score of "score".
    await redis.zadd(LEADERBOARD_KEY, score, playerId);

    /*
    Think of it like this:-
    Redis key: "leaderboard"
    ├── alice  → 500
    ├── rishav → 400
    └── john   → 100 
    */

    return {
        playerId,
        score
    };
};

export const updateScore = async (playerId, score) => {
    await redis.zadd(LEADERBOARD_KEY, score, playerId);

    return {
        playerId,
        score
    };
};

export const incrementScore = async (playerId, amount) => {
    const score = await redis.zincrby(
        LEADERBOARD_KEY,
        amount,
        playerId
    );

    return {
        playerId,
        score: Number(score)
    };
};

export const getTopPlayers = async (limit = 10) => {
    const players = await redis.zrevrange(
        LEADERBOARD_KEY,
        0,
        limit - 1,
        "WITHSCORES"
    );

    const result = [];

    for (let i = 0; i < players.length; i += 2) {
        result.push({
            playerId: players[i],
            score: Number(players[i + 1]),
            rank: i / 2 + 1
        });
    }

    return result;
};

export const getPlayerRank = async (playerId) => {
    const rank = await redis.zrevrank(
        LEADERBOARD_KEY,
        playerId
    );

    if (rank === null) {
        return null;
    }

    const score = await redis.zscore(
        LEADERBOARD_KEY,
        playerId
    );

    return {
        playerId,
        score: Number(score),
        rank: rank + 1
    };
};

export const getPlayersAround = async (playerId, range = 2) => {
    const rank = await redis.zrevrank(
        LEADERBOARD_KEY,
        playerId
    );

    if (rank === null) {
        return null;
    }

    const start = Math.max(0, rank - range);
    const end = rank + range;

    const players = await redis.zrevrange(
        LEADERBOARD_KEY,
        start,
        end,
        "WITHSCORES"
    );

    const result = [];

    for (let i = 0; i < players.length; i += 2) {
        const currentPlayer = players[i];

        const currentRank = await redis.zrevrank(
            LEADERBOARD_KEY,
            currentPlayer
        );

        result.push({
            playerId: currentPlayer,
            score: Number(players[i + 1]),
            rank: currentRank + 1
        });
    }

    return result;
};

export const removePlayer = async (playerId) => {
    const result = await redis.zrem(
        LEADERBOARD_KEY,
        playerId
    );

    return result === 1;
};

export const getTotalPlayers = async () => {
    return await redis.zcard(LEADERBOARD_KEY);
};



/*
ZADD      - add a player or set their score
ZINCRBY   - increase a player's score
ZREVRANGE - get players from highest score to lowest
ZREVRANK  - get a player's position in descending order
ZSCORE    - get a player's score
ZREM      - remove a player
ZCARD     - count players

ZINCRBY is used for score increments. Redis performs the increment atomically, so two concurrent increments won't overwrite each other.
*/