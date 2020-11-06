let boardToImage = require('./main/image').boardToImage
let TicTacToe = require('./main/tic_tac_toe')
let TwitterService = require('./main/twitter')
let FirebaseServices = require('./main/firebase')

//initialize firebase
const firebase = new FirebaseServices();

//initialize Twit 
const twitter = new TwitterService();

twitter.startTagsStream(newTweetCallBack);

async function newTweetCallBack(tweet) {

    let userId = tweet.user.id;
    let userName = tweet.user.name;
    let threadId = tweet.id_str;
    let tweetText = tweet.text;
    let board, whoseWon;
    var aiScore = 0, playerScore = 0, tieScore = 0
    let humanMove = TicTacToe.getHumanMove(tweetText)

    console.log(`New mention from ${userName}, ${tweetText}`)

    //Get player's game session from Firebase (if any)
    let game = await firebase.getGame(userId);
    if (game) {
        board = game['board'];
        aiScore = game['aiScore']
        playerScore = game['playerScore']
        tieScore = game['tieScore']

        if (board && board.length && !TicTacToe.emptyIndexes(board).includes(humanMove))
            return twitter.postNotValidMove(TicTacToe.getValidMoves(board), threadId);
    }

    game = TicTacToe.play({ board: board, humanMove: humanMove })
    board = game['board'];
    whoseWon = game['whoseWon'];

    if (whoseWon) (whoseWon == 'ai') ? aiScore++ : (whoseWon == 'tie') ? tieScore++ : (whoseWon == 'human') ? playerScore++ : false;

    boardToImage(board, whoseWon).then(b64BoardImage => {
        twitter.postImage(b64BoardImage, `TicTacToe bot(❌) VS ${userName}(⭕️)\n\nScores:\n🤖 Me: ${aiScore}\n🤡 You: ${playerScore}\n⚖️ Tie: ${tieScore}`, threadId);
    })

    if (whoseWon != 'nobody') board = [] //Clear the board if there is a winner

    firebase.setGame(board, userId, aiScore, playerScore, tieScore)//Save the game session in Firebase

}

