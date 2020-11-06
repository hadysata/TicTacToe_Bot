const botUsername = 'TicTacToe_ai'

const Twit = require('twit')
require('dotenv').config()

module.exports = class TwitterService {

    constructor() {
        this.T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
            strictSSL: false,     // optional - requires SSL certificates to be valid.
        })
    }

    tweet(params) {
        this.T.post('statuses/update', params, this.tweeted);
    }

    async postImage(base64Image, status, threadId) {
        const data = (await this.T.post('media/upload', { media_data: base64Image })).data;
        this.postTweetWithMedia(data, { status: status, threadId: threadId })
    }

    postTweetWithMedia(data, { status, threadId }) {
        let params = {
            status: status,
            in_reply_to_status_id: threadId,
            media_ids: [data.media_id_string],
            auto_populate_reply_metadata: true
        }
        this.tweet(params);
    };

    postNotValidMove(validMoves, threadId) {
        let params = {
            status: `This is not a valid move, valid moves: ${validMoves}`,
            in_reply_to_status_id: threadId,
            auto_populate_reply_metadata: true
        }
        this.tweet(params);
    };

    tweeted(err, data) {
        console.log(data.text)
        if (err) console.log(err)
    }

    startTagsStream(newTweetCallBack) {
        let stream = this.T.stream('statuses/filter', { track: `@${botUsername}` });
        stream.on('tweet', newTweetCallBack);
        console.log("Tags stream: on\nWaiting for new mentions...")
    }

}


