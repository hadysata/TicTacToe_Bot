const humanPlayer = "O";
const aiPlayer = "X";
const corners = [0, 2, 6, 8];
const emptyBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function play({ board, humanMove }) {
    if (!board || !board.length || emptyIndexes(board).length == 0) board = [...emptyBoard]
    if (board.includes(humanMove) && emptyIndexes(board).length >= 0 && emptyIndexes(board).length <= 9) {
        board[humanMove] = humanPlayer;
        board[minimax(board, aiPlayer).index] = aiPlayer;
        if (emptyIndexes(board).length == 1) board[emptyIndexes(board)[0]] = humanPlayer //Play the last move if possible
    } else {
        board[getRandomItem(corners)] = aiPlayer
    }
    return { 'board': board, 'whoseWon': whoseWon(board) };
}

function whoseWon(board) {
    const isHumanWinning = winning(board, humanPlayer);
    const isAiWinning = winning(board, aiPlayer);
    const isTie = emptyIndexes(board).length <= 0 && !isHumanWinning && !isAiWinning;
    return isHumanWinning ? 'human' : isAiWinning ? 'ai' : isTie ? 'tie' : 'nobody';
}

function minimax(newBoard, player) {

    const availableSpots = emptyIndexes(newBoard);

    if (winning(newBoard, humanPlayer)) {
        return { score: -10 };
    }
    else if (winning(newBoard, aiPlayer)) {
        return { score: 10 };
    }
    else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];

    for (var i = 0; i < availableSpots.length; i++) {
        var move = {};
        move.index = newBoard[availableSpots[i]];

        newBoard[availableSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function emptyIndexes(board) {
    return board.filter(s => s != "O" && s != "X");
}

function getValidMoves(board) {
    return emptyIndexes(board).map(function (val) { return ++val; }).toString();
}

function getHumanMove(text) {
    let humanMove = text.match(/\d+/) ? parseInt(text.match(/\d+/)[0]) : false;
    if (!humanMove) {
        humanMove = 9
        console.log("Invalided human move")
    } else {
        humanMove--
    }

    return humanMove;
}

function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}

function getRandomItem(Array) {
    return Array[Math.floor(Math.random() * Array.length)];
}

module.exports = {
    play,
    emptyIndexes,
    getValidMoves,
    getHumanMove,
};
