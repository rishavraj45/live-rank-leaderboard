# Live Rank Leaderboard

A real-time leaderboard system built using Node.js, Express.js, Redis, and Socket.IO.

The system uses Redis Sorted Sets for efficient score management and ranking, while
Socket.IO provides real-time leaderboard updates to all connected clients.

## Features

- Real-time leaderboard updates using Socket.IO
- Redis Sorted Sets for efficient ranking
- Player creation and deletion
- Set player scores
- Increment player scores
- Retrieve top-K players
- Retrieve a player's rank and score
- Retrieve players around a given player
- REST APIs for leaderboard operations
- Dockerized Redis setup
- Modular backend architecture

## Tech Stack

- Node.js
- Express.js
- Redis
- Socket.IO
- ioredis
- Docker
- REST APIs

## Project Structure

```text
live-rank-leaderboard/
│
├── config/
│   └── redis.js
│
├── controllers/
│   └── leaderboardController.js
│
├── routes/
│   └── leaderboardRoutes.js
│
├── services/
│   └── leaderboardService.js
│
├── public/
│   └── index.html
│
├── socket.js
├── server.js
├── package.json
├── docker-compose.yml
├── .env
└── .gitignore

## Architecture
                    ┌───────────────┐
                    │   Browser 1   │
                    └───────▲───────┘
                            │
                            │ WebSocket
                            │
┌──────────────┐      ┌────┴──────────┐
│   REST API   │─────►│    Node.js    │
│   / Postman  │      │ Express +     │
└──────────────┘      │ Socket.IO     │
                      └──────┬────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │    Redis     │
                      │ Sorted Set   │
                      └──────────────┘


## Real-Time Update Flow

-Socket.IO is used to synchronize leaderboard changes across connected clients.

-When a player's score changes:

Player Score Update
        |
        v
   REST API Request
        |
        v
   Node.js / Express
        |
        v
   Redis Sorted Set
        |
        v
 Updated Leaderboard
        |
        v
   Socket.IO Broadcast
        |
        +---------------> Browser 1
        |
        +---------------> Browser 2
        |
        +---------------> Browser 3

- All connected clients receive the updated leaderboard immediately without requiring a page refresh.
```

## The request flows like this:
  ```Example of increment score```
1. server.js receives the HTTP request.
2. leaderboardRoutes.js matches the PATCH route.
3. Validation middleware checks the player ID and amount.
4. leaderboardController.js calls incrementScore().
5. leaderboardService.js runs Redis ZINCRBY.
6. The controller calls broadcastLeaderboard().
7. socket.js broadcasts leaderboard:update.
8. Each browser tab receives the event and updates its table.
9. The controller sends the JSON response to Postman.
That is the core architecture: routes direct requests, controllers coordinate, services handle Redis, and Socket.IO pushes changes to connected browsers.


```
Postman / Browser ---> http request to server.js ---> leaderboardRoutes.js ---> leaderboardController.js ---> leaderboardService.js ---> Redis.

For live updates, Socket.IO
    score changes in Redis ---> broadcastLeaderboard() ---> Socket.IO sends leaderboard:update ---> all connected browser tabs update
```
