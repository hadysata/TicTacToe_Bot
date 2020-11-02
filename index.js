let setGame = require('./main/firebase').setGame
let getGame = require('./main/firebase').getGame
let boardToImage = require('./main/image').boardToImage
let play = require('./main/minimax').play
let emptyIndexes = require('./main/minimax').emptyIndexes
require('dotenv').config()
const fs = require('fs');

//initialize firebase

const admin = require('firebase-admin');

const serviceAccount = require('/Users/Hadi/Documents/GitHub/TicTacToe_Bot/assets/firebase/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


// twitter

var Twit = require('twit')

var T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: false,     // optional - requires SSL certificates to be valid.
})

function postTweet(status) {
    T.post('statuses/update', { status: status }, tweeted)
}

function tweeted(err, data, response) {
    console.log(data.text)
    if (err)
        console.log(err)
}



var stream = T.stream('statuses/filter', { track: '@TicTacToe_ai' });


stream.on('tweet', newTweet)

async function newTweet(tweet) {

    let userId = tweet.user.id;
    let userName = tweet.user.name;
    let threadId = tweet.id_str;
    let txt = tweet.text;
    var aiScore = 0, playerScore = 0, tieScore = 0

    console.log(`New mention from ${userName}, ${txt}`)

    getGame(userId, db).then(firebaseGame => {
        let game;
        let humanMove = parseInt(txt.match(/\d+/)[0]);
        if (!humanMove) {
            humanMove = 9
            console.log("Invalided human move")
        }else{
            humanMove--
        }

        if (firebaseGame) {
            aiScore = firebaseGame['aiScore']
            playerScore = firebaseGame['playerScore']
            tieScore = firebaseGame['tieScore']


            if (firebaseGame['board'] && emptyIndexes(firebaseGame['board']).length > 0 && emptyIndexes(firebaseGame['board']).length < 9) {

                let board = firebaseGame['board'];


                if (emptyIndexes(board).includes(humanMove)) {
                    game = play({ board: board, humanMove: humanMove })
                } else {
                    return postNotValidInput(emptyIndexes(board).map(function (val) { return ++val; }).toString());
                }
            } else {
                console.log("a new game")
                game = play({ humanMove: humanMove });
            }
        } else {
            console.log("a new game")
            game = play({ humanMove: humanMove });
        }

        if (game != undefined && game['whoseWon'] != undefined)
            if (game['whoseWon'] == 'ai') aiScore++; else if (game['whoseWon'] == 'tie') tieScore++; else if (game['whoseWon'] == 'human') playerScore++


        boardToImage(game['board'], game['whoseWon']).then(b64BoardImage => {
            b64BoardImage = b64BoardImage.replace("data:image/png;base64,", "")
            T.post('media/upload', { media_data: b64BoardImage }, postTweetWithMedia);
        })


        if (game['whoseWon'] != 'nobody') game['board'] = []
        setGame(game['board'], userId, aiScore, playerScore, tieScore, db)

    })

    // console.log(tweet)

    function postTweetWithMedia(err, data, response) {
        let mediaIdStr = data.media_id_string;
        let params = {
            status: `Tic Tac Toe bot(❌) VS ${userName}(⭕️)\n\nScores:\n🤖 Me: ${aiScore}\n🤡 You: ${playerScore}\n⚖️ Tie: ${tieScore}`,
            in_reply_to_status_id: threadId,
            media_ids: [mediaIdStr],
            auto_populate_reply_metadata: true
        }      // Post tweet
        T.post('statuses/update', params, tweeted);
    };

    function postNotValidInput(validMoves) {
        let params = {
            status: `This is not a valid move, valid moves: ${validMoves}`,
            in_reply_to_status_id: threadId,
            auto_populate_reply_metadata: true
        }      // Post tweet
        T.post('statuses/update', params, tweeted);
    };

}

