
var score = 0;
var cardList = [
    "Alien1",
    "Alien2",
    "Alien3",
    "Alien4",
    "Alien5",
    "Alien6",
    "Alien7",
    "Alien8",
    "Alien9",
    "Alien10",
    "Alien11"
]


var cardSet;
var board = [];
var rows = 4;
var columns =4;

var card1Selected;
var card2Selected;

window.onload = function() {
    shuffleCards();
    startGame();
}

function shuffleCards() {
    cardSet = cardList.concat(cardList); //two of each card
    console.log(cardSet);
    //shuffle
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length); //get random index
        //swap
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
    console.log(cardSet);
}

function startGame() {
    
    for (let r = 0; r < 4; r++) {
        let row = [];
        
        for (let c = 0; c < 4; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg); //JS
            let card = document.createElement("img");
            card.id = r.toString() + "+" + c.toString();
            card.src = cardImg + ".png";
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);

        }
        board.push(columns);
    }
    console.log(board);    
}


function selectCard() {

    if (this.src.includes("back")) {
        if (!card1Selected) {
            card1Selected = this;

            let coords = card1Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = board[r][c] + ".jpg";
        }
        else if (!card2Selected && this != card1Selected) {
            card2Selected = this;

            let coords = card2Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = board[r][c] + ".jpg";
            setTimeout(update, 1000);
        }
    }

}

