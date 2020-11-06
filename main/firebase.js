const admin = require('firebase-admin');
const serviceAccount = require('./../assets/firebase/serviceAccountKey.json');

module.exports = class FirebaseServices {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.db = admin.firestore();
    }

    async setGame(board, playerId, aiScore = 0, playerScore = 0, tieScore = 0) {
        const docRef = this.db.collection('players').doc(playerId.toString());
        await docRef.set({
            board: board,
            aiScore: aiScore,
            playerScore: playerScore,
            tieScore: tieScore
        });
        console.log(`set a game with ${playerId}`)
    }

    async getGame(playerId) {
        const documentSnapshot = await this.db.collection('players').doc(playerId.toString()).get();
        return documentSnapshot.data();
    }

};






