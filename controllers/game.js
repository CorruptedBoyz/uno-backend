const Card = require('../models/card')

GameParameters = {
    Turn: "",
    Started: false,
    Players: [],
    CardOnBoard: null,
}

const startGame = async () => {
    await Card.collection.drop()
    console.log("Game Started")
    // Create 5 random cards for each player
    const userCards1 = createRandomCard(5)
    const userCards2 = createRandomCard(5)

    // Initialize players hand and write to database
    const userName1 = GameParameters.Players[0]
    const userName2 = GameParameters.Players[1]
    await Card.create({name: userName1.toString(), cards: userCards1})
    await Card.create({name: userName2.toString(), cards: userCards2})

    // Put a random card to the board
    GameParameters.CardOnBoard = createRandomCard()[0]

    // Set GameParameters
    GameParameters.Started = true
    GameParameters.Turn = makeTurn()

    // Return userhands and card on the board
}

const drawCard = async (userName) => {
    // Check if player already drew a card this turn
    if (GameParameters.Turn !== userName) {
        throw Error("It's not your turn")
    }
    const other = getOtherUser(userName)
    const user = await Card.findOne({name: userName})
    const otherUser = await Card.findOne({name: other})
    if (user.drewCard) {
        throw Error("You cannot draw more than once in a turn")
    }

    // Create a random card
    const randomCard = createRandomCard()[0]

    // Update both player's hand on database
    user.cards.push(Object.assign({}, randomCard))
    user.drewCard = true
    otherUser.drewCard = false;
    otherUser.save()
    user.save()               // TODO - kart çekme işlemini make move da yap

    // Return both players hand ???????????
    return {}
}

const makeMove = async (userName, card) => {
    // Check if the card can be played throw error if not
    const user = await Card.findOne({name: userName})

    if (GameParameters.Turn !== userName) {
        throw Error("It's not your turn")
    }
    if (card.color !== "Black" && card.color !== GameParameters.CardOnBoard.color && card.text !== GameParameters.CardOnBoard.text) {
        throw Error("You cannot play this card")
    }

    GameParameters.CardOnBoard = card
    GameParameters.Turn = getOtherUser(userName)

    // Update player's hand on database
    await Card.collection.updateOne({_id: user._id}, {$pull: {'cards': card}}) // TODO - user.save ile yapmayı dene
    // const userUpdated = await Card.findOne({name: userName}) //TODO - Is it necesssary ???

    // Return player's hand and size


}

const passTurn = async (userName) => {
    GameParameters.Turn = getOtherUser(userName)

    await Card.findOneAndUpdate({name:userName},{drewCard:false})
}

const isGameOver = async (userName) => {
    // Check if any of the players hand is empty after a move
    const user = await Card.findOne({name: userName})

    const handSize = user.cards.length
    if (handSize !== 0) {
        return false
    }
    console.log("Alert")

    // Set Started false
    GameParameters.Started = false
    GameParameters.Turn = ""

    // Save/Remove previous game cards
    await Card.collection.drop()

    // End the game                TODO - End game
    return true
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

const createPlayer = (userName) => {
    if (GameParameters.Players.length < 2) {
        GameParameters.Players.push(userName)
    } else {
        throw  Error("No more room")
    }
    return GameParameters.Players.length === 2
}

const makeTurn = () => {
    return GameParameters.Players[Math.floor(Math.random()) * 2]
}

const getGameDetails = async (userName) => {

    const cardOnBoard = GameParameters.CardOnBoard
    const turn = GameParameters.Turn
    const otherUser = GameParameters.Players.filter(x => x !== userName)[0]
    const handSize = (await Card.findOne({name: otherUser})).cards.length
    const user = (await Card.findOne({name: userName})).cards

    return {cardOnBoard, turn, handSize, user}
}

const getOtherUser = (userName) => {
    const other = GameParameters.Players.filter((name) => {
        return name !== userName
    })[0]

    return other
}


module.exports = {drawCard, isGameOver, getGameDetails, makeMove, createPlayer, startGame,passTurn}