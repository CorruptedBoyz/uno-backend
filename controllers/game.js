const Card = require('../models/card')

GameParameters = {
    Turn: String,
    Started: Boolean,
    Players: Array,
    CardOnBoard: Object,
}

const drawCard = async (userName) => {
    // Check if player already drew a card this turn
    const other = GameParameters.Players.filter((name) => {
        return name !== userName
    })[0]
    const user = await Card.findOne({name: userName})
    const otherUser = await Card.findOne({name: other})
    if (user.drewCard) {
        throw "You cannot draw more than once in a turn"
    }

    // Create a random card
    const randomCard = createRandomCard()

    // Update both player's hand on database
    user.cards.push(Object.assign({}, randomCard[0]))
    user.drewCard = true
    otherUser.drewCard = false;
    otherUser.save()
    user.save()

    // Return both players hand ???????????
}

const startGame = async (userName1, userName2) => {
    // Create 5 random cards for each player
    const userCards1 = createRandomCard(5)
    const userCards2 = createRandomCard(5)

    // Initialize players hand and write to database
    await Card.create({name: userName1.toString(), cards: userCards1})
    await Card.create({name: userName2.toString(), cards: userCards2})

    // Put a random card to the board
    GameParameters.CardOnBoard = {color: "Yellow", text: 5}

    // Set GameParameters
    GameParameters.Started(true)
    GameParameters.Players = [userName1.toString(), userName2.toString()]
}

const makeMove = async (userName, card) => {
    // Check if the card can be played throw error if not
    const user = await Card.findOne({name: userName})
    if (user.drewCard) {
        throw "It's not your turn"
    }
    if (card.color !== "Black" && card.color !== GameParameters.CardOnBoard.color && card.text !== GameParameters.CardOnBoard.text) {
        throw "You cannot play this card"
    }

    // Update player's hand on database
    await Card.collection.updateOne({_id: user._id}, {$pull: {'cards': card}})
    const handSize = await Card.findOne({name: userName})
    // Return player's hand and size

    isGameOver(handSize.cards.length)
}

const isGameOver = async (handSize) => {
    // Check if any of the players hand is empty after a move
    if (handSize !== 0) {
        return false
    }

    // Set Started false
    GameParameters.Started(false)

    // Save/Remove previous game cards
    await Card.collection.drop()

    // End the game                TODO - End game
}

const createRandomCard = (count = 1) => {
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
        cardStack.push({color, text})
    }
    return cardStack
}

module.exports = {drawCard, startGame, makeMove, isGameOver}