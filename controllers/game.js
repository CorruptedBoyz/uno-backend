const Card = require('../models/card')

GameParameters = {
    Turn: String,
    Started: Boolean,
}

UserParameters = {
    FirstUser: {
        DrewCard:false,
    },
    SecondUser: {
        DrewCard:false,
    }
}


const drawCard = async (userName) => {
    // Check if player already drew a card this turn
    const user =await Card.findOne({name:userName})
    if(user.drewCard){
        throw new Error({message:"You cannot draw more than once in a turn"})
    }

    // Create a random card
    const randomCard=createRandomCard()

    // Update player's hand on database
    await user.cardDraw({randomCard})

    // Return both players hand ???????????
}

const startGame = async (userName1,userName2) => {
    // Create 5 random cards for each player
    const userCards1 = createRandomCard(5)
    const userCards2 = createRandomCard(5)

    // Initialize players hand and write to database
    await Card.create({user:{name:userName1.toString(),cards:userCards1}})
    await Card.create({user:{name:userName2.toString(),cards:userCards2}})

    // Put a random card to the board
    const starterCard = createRandomCard()

    // Set OnGoing true
    GameParameters.Started=true

    // Return player hands and starter card
    return {starterCard,userCards1,userCards2}
}

const makeMove = async (userName, card) => {
    // Check if the card can be played
    // Throw error if not
    // Otherwise update player's hand on database
}

const isGameOver = () => {
    // Check if any of the players hand is empty after a move
    // Set OnGoing false
    // Redirect to some page
    // Save/Remove previous game cards
}


const createRandomCard = (count=1) => {
    let cardStack = []
    for (let i = 0; i < count; i++) {
        let randomNumber = Math.floor(Math.random() * 112)
        let color;
        let text;

        if (randomNumber < 25) {
            color = "Red"
        } else if (randomNumber < 50) {
            color = "Yellow"
        } else if (randomNumber < 75) {
            color = "Green"
        } else if (randomNumber < 100) {
            color = "Blue"
        } else {
            color = "Black"
        }
        if (color !== "Black") {
            text = Math.floor(Math.random() * 10).toString()
        } else {
            const textValues = ["+2", "+4", "Wild"]
            text = textValues[Math.floor(Math.random() * 3)]
        }
        cardStack.push({text, color})
    }

    return cardStack
}

module.exports = {drawCard, startGame, makeMove, isGameOver}