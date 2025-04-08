import User from "../models/User.model.js";

const games = {}; // { roomId: { board, players, currentPlayer, timer, winner } }
const waitingPlayers = []; // Queue for matchmaking
const activePlayers = {}; // { userid }

const createEmptyBoard = () => Array(16).fill(null);

const checkWinner = (board) => {
    const lines = [
        // Horizontal
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],

        // Vertical
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],

        // Diagonal (Top-Left to Bottom-Right)
        [0, 5, 10, 15],

        // Diagonal (Top-Right to Bottom-Left)
        [3, 6, 9, 12]
    ];

    for (let line of lines) {
        const [a, b, c, d] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
            return { winner: board[a], winningCells: line };
        }
    }
    return null;
};

const startTimer = async (io, roomId) => {
    if (!games[roomId]) return;

    games[roomId].timer = 10; // Reset timer
    clearInterval(games[roomId].interval); // Clear any previous interval

    games[roomId].interval = setInterval(async () => {
        if (!games[roomId]) return;

        games[roomId].timer -= 1;
        io.to(roomId).emit('timerUpdate', games[roomId].timer);

        if (games[roomId].timer === 0) {
            const currentPlayer = games[roomId].currentPlayer;
            const winner = games[roomId].players.find(p => p !== currentPlayer);

            const winningCells = games[roomId].board
                .map((value, index) => (value === winner ? index : null))
                .filter(index => index !== null);

            io.to(roomId).emit('gameOver', {
                winner: winner,
                winningCells: winningCells,
                isDraw: false,
                timer: true
            });

            const player1Id = io.sockets.sockets.get(winner).user._id;
            const player2Id = io.sockets.sockets.get(currentPlayer).user._id;

            const player1 = await User.findById(player1Id);
            const player2 = await User.findById(player2Id);

            if (!player1 || !player2) console.log("Cannot able to find players!");

            player1.score = JSON.stringify(Number.parseInt(player1.score) + 5);
            player2.score = JSON.stringify(Number.parseInt(player2.score) - 3);

            const savedP1 = await player1.save();
            const savedP2 = await player2.save();

            if (!savedP1 || !savedP2) console.log("Cannot able to save player scores!");

            delete games[roomId];
        }
    }, 1000);
};

const connection = async (io, socket) => {
    if (activePlayers[socket.user._id]) {
        const prevSocketId = activePlayers[socket.user._id];
        const prevSocket = socket.server.sockets.sockets.get(prevSocketId);

        if (prevSocket) {
            disconnect(io, prevSocket);
        }

    }
    activePlayers[socket.user._id] = socket.id;

    const index = waitingPlayers.findIndex(p => p.id === socket.id);
    if (index !== -1) {
        waitingPlayers.splice(index, 1);
    }

    startMatchmaking(io, socket);
};

const startMatchmaking = async (io, socket) => {
    if (waitingPlayers.length > 0) {
        const opponent = waitingPlayers.shift();
        const roomId = `${socket.id}-${opponent.id}`;

        games[roomId] = {
            board: createEmptyBoard(),
            players: [socket.id, opponent.id],
            currentPlayer: socket.id,
            timer: 10,
            winner: null,
        };

        socket.join(roomId);
        opponent.join(roomId);

        io.to(socket.id).emit("opponentDetails", opponent.user);
        io.to(opponent.id).emit("opponentDetails", socket.user);

        io.to(roomId).emit('gameStart', { game: games[roomId], roomId: roomId });
        io.to(roomId).emit('gameState', games[roomId]);
    } else {
        waitingPlayers.push(socket);
    }
};

const makeMove = (io, socket) => {
    socket.on('makeMove', async ({ roomId, index }) => {
        const game = games[roomId];
        if (game && !game.winner && game.board[index] === null && game.currentPlayer === socket.id) {
            game.board[index] = socket.id;

            clearInterval(game.interval); // Stop the timer when a move is made

            const winnerInfo = checkWinner(game.board);
            if (winnerInfo) {
                game.winner = winnerInfo.winner;
                io.to(roomId).emit('gameOver', {
                    winner: winnerInfo.winner,
                    winningCells: winnerInfo.winningCells,
                    isDraw: false,
                });

                const player1Id = io.sockets.sockets.get(game.players[0]).user._id;
                const player2Id = io.sockets.sockets.get(game.players[1]).user._id;

                const player1 = await User.findById(player1Id);
                const player2 = await User.findById(player2Id);

                if (!player1 || !player2) console.log("Cannot able to find players!");

                if (game.winner === game.players[0]) {
                    player1.score = JSON.stringify(Number.parseInt(player1.score) + 5);
                    player2.score = JSON.stringify(Number.parseInt(player2.score) - 3);
                } else {
                    player1.score = JSON.stringify(Number.parseInt(player1.score) - 3);
                    player2.score = JSON.stringify(Number.parseInt(player2.score) + 5);
                };

                const savedP1 = await player1.save();
                const savedP2 = await player2.save();

                if (!savedP1 || !savedP2) console.log("Cannot able to save player scores!");

                delete games[roomId];
            } else if (!game.board.includes(null)) {
                io.to(roomId).emit('gameOver', {
                    winner: 'Draw',
                    winningCells: null,
                    isDraw: true,
                });
                const player1Id = io.sockets.sockets.get(game.players[0]).user._id;
                const player2Id = io.sockets.sockets.get(game.players[1]).user._id;

                const player1 = await User.findById(player1Id);
                const player2 = await User.findById(player2Id);

                if (!player1 || !player2) console.log("Cannot able to find players!");

                player1.score = JSON.stringify(Number.parseInt(player1.score) + 3);
                player2.score = JSON.stringify(Number.parseInt(player2.score) + 3);

                const savedP1 = await player1.save();
                const savedP2 = await player2.save();

                if (!savedP1 || !savedP2) console.log("Cannot able to save player scores!");

                delete games[roomId];
            } else {
                game.currentPlayer = game.players.find(p => p !== socket.id);
                startTimer(io, roomId); // Restart timer for the next player
            }

            io.to(roomId).emit('gameState', {
                board: [...game.board],
                currentPlayer: game.currentPlayer,
                timer: game.timer,
            });
        }
    });
};

const disconnect = async (io, socket) => {
    if (socket === undefined) return;

    // Remove the player from waiting queue
    const index = waitingPlayers.findIndex(p => p.id === socket.id);
    if (index !== -1) {
        waitingPlayers.splice(index, 1);
    }

    // Remove the player from ongoing games
    for (const roomId in games) {
        const game = games[roomId];
        if (game.players.includes(socket.id)) {
            // Remove disconnected player from game
            game.players = game.players.filter(p => p !== socket.id);

            if (game.players.length != 0) {
                const winningCells = game.board.map((value, index) => (value === game.players[0] ? index : null))
                    .filter(index => index !== null);
                io.to(roomId).emit('gameOver', {
                    winner: game.players[0],
                    winningCells: winningCells,
                    isDraw: false,
                    left: true
                });

                const player1Id = io.sockets.sockets.get(game.players[0]).user._id;
                const player2Id = socket.user._id;

                const player1 = await User.findById(player1Id);
                const player2 = await User.findById(player2Id);

                if (!player1 || !player2) console.log("Cannot able to find players!");


                player1.score = JSON.stringify(Number.parseInt(player1.score) + 5);
                player2.score = JSON.stringify(Number.parseInt(player2.score) - 3);

                const savedP1 = await player1.save();
                const savedP2 = await player2.save();

                if (!savedP1 || !savedP2) console.log("Cannot able to save player scores!");
            }
            delete games[roomId];
        }
    }

    delete activePlayers[socket.user._id];
    socket.disconnect(true);
};

const onDisconnect = async (io, socket) => {
    socket.on('disconnect', () => disconnect(io, socket));
}

export {
    connection,
    makeMove,
    onDisconnect,
};