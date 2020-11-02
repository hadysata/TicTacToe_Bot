async function setGame(board, playerId, aiScore = 0, playerScore = 0 , tieScore = 0, db) {
    const docRef = db.collection('players').doc(playerId.toString());

    await docRef.set({
        board: board,
        aiScore: aiScore,
        playerScore: playerScore,
        tieScore: tieScore
    });

    console.log(`set a game with ${playerId}`)
}

async function getGame(playerId , db){
    const documentSnapshot = await db.collection('players').doc(playerId.toString()).get();
    return documentSnapshot.data();
}

// module.exports = {
//     setGame,
//     getGame
//   }

  module.exports.setGame = setGame;
  module.exports.getGame = getGame;







