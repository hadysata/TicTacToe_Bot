const Jimp = require("jimp");
const boardPath = '../assets/images/board.png';

const positions = {
    1: [261, 222],
    2: [520, 222],
    3: [770, 222],
    4: [261, 478],
    5: [520, 478],
    6: [770, 478],
    7: [261, 750],
    8: [520, 750],
    9: [770, 750],
}

function boardToImage(board, result, id = (+new Date).toString(36).slice(-5)) {
    var loadedImage;

    Jimp.read(boardPath)
        .then(function (image) {
            loadedImage = image;
            return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
        })
        .then(function (font) {


            for (let index = 0; index < board.length; index++) {
                const boardElement = board[index];
                if (boardElement == 'X' || boardElement == 'O')
                    loadedImage.print(font, positions[index + 1][0], positions[index + 1][1], boardElement)
            }

            if (result != 'nobody') {
                loadedImage.blur(15)

                if (result == 'ai') {
                    loadedImage.print(font, 385, 480, "I won :)")
                } else if (result == 'human') {
                    loadedImage.print(font, 320, 480, "You won !!!")
                } else if (result == 'tie') {
                    loadedImage.print(font, 210, 480, "Tie Game -_-")
                }
            }


            loadedImage.write(`../games/${id}.png`);

            return id;
        })
        .catch(function (err) {
            console.error(err);
        });
}

