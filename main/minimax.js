const huPlayer = "O";
const aiPlayer = "X";

function play({ board = [0, 1, 2, 3, 4, 5, 6, 7, 8], humanMove = 9 }) {
    if (board.includes(humanMove)) {
        board[humanMove] = huPlayer;
        board[minimax(board, aiPlayer).index] = aiPlayer;
        return { 'board': board, 'whoseWon': whoseWon(board) };
    } else {

        board[getRandomInt(0, 8)] = aiPlayer
        return { 'board': board, 'whoseWon': whoseWon(board) };
    }
}

function whoseWon(board) {
    const isHumanWinning = winning(board, huPlayer);
    const isAiWinning = winning(board, aiPlayer);
    const isTie = emptyIndexes(board).length <= 0 && !isHumanWinning && !isAiWinning;
    return isHumanWinning ? 'human' : isAiWinning ? 'ai' : isTie ? 'tie' : 'nobody';
}

function minimax(newBoard, player) {

    var availSpots = emptyIndexes(newBoard);

    if (winning(newBoard, huPlayer)) {
        return { score: -10 };
    }
    else if (winning(newBoard, aiPlayer)) {
        return { score: 10 };
    }
    else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];

    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];

        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.play = play;
module.exports.emptyIndexes = emptyIndexes;
