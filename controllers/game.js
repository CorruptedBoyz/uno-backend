const Card = require('../models/card')
const GameParameters = require('../models/gameParameters')


const startGame = async () => {
    console.log("Game Started")
    await Card.collection.drop()

    // Create 5 random cards for each player
    const userCards1 = createRandomCard(5)
    const userCards2 = createRandomCard(5)

    // Initialize players hands, GameParameters and write to database           // TODO - Card koleksiyonunu GameParameters içine al ??
    const GameParameter = await GameParameters.findOne({})
    const userName1 = GameParameter.players[0]
    const userName2 = GameParameter.players[1]
    await Card.create({name: userName1, cards: userCards1})
    await Card.create({name: userName2, cards: userCards2})

    // Put a random card to the board
    let candidateCard;
    do
        candidateCard = createRandomCard()[0]
    while (candidateCard.color === ("Black" || "Combo"))

    GameParameter.cardOnBoard = candidateCard

    // Set GameParameters
    GameParameter.started = true
    GameParameter.turn = GameParameter.players[makeTurn()]

    await GameParameter.save();
}

const drawCard = async (userName) => {
    // Check if player already drew a card this turn
    const GameParameter = await GameParameters.findOne({})

    if (GameParameter.turn !== userName) {
        throw Error("It's not your turn")
    }

    const user = await Card.findOne({name: userName})

    if (user.drewCard) {
        throw Error("You cannot draw more than once in a turn")
    }

    const other = await getOtherUser(userName)
    const otherUser = await Card.findOne({name: other})

    // Create a random card
    const randomCards = createRandomCard(GameParameter.currentBid + 1)
    GameParameter.currentBid = 0

    // Update both player's hand on database
    user.cards.push(...randomCards)
    user.drewCard = true
    otherUser.drewCard = false;
    await GameParameter.save()
    await otherUser.save()
    await user.save()

}

const makeMove = async (userName, card) => {
    const GameParameter = await GameParameters.findOne({})

    const user = await Card.findOne({name: userName})

    // Validate move
    validatePlayedCard({userInfo: user, playedCard: card, gameParameters: GameParameter})

    // Remove the card from user's hand
    for (let i = 0; i < user.cards.length; i++) {
        if (user.cards[i].text === card.text && user.cards[i].color === card.color) {
            user.cards.splice(i, 1);
            break;
        }
    }

    // If the card is non-black and there is a currentBid
    if (GameParameter.currentBid !== 0 && (card.text !== "+2" || card.text !== "+4")) {
        user.cards.push(...createRandomCard(GameParameter.currentBid))
        GameParameter.currentBid = 0
    }

    // If the card is black
    if (card.color === "Black") {
        switch (card.text) {
            case "Wild":
                card = {color: card.choosenColor, text: card.text}
                if (GameParameter.currentBid !== 0) {
                    user.cards.push(...createRandomCard(GameParameter.currentBid))
                    GameParameter.currentBid = 0
                }
                break;
            case "+2":
                card = {color: card.choosenColor, text: card.text}
                GameParameter.currentBid += Number(card.text)
                break;
            case "+4":
                card = {color: card.choosenColor, text: card.text}
                GameParameter.currentBid += Number(card.text)
                break;
        }
    }

    if (card.text!=="Combo!"){
        GameParameter.turn = await getOtherUser(userName)
    }

    // Change GameParameters
    GameParameter.cardOnBoard = card

    // Save changes on database
    await GameParameter.save()
    await user.save()

}

const passTurn = async (userName) => {
    const GameParameter = await GameParameters.findOne({})

    if (GameParameter.turn !== userName) {
        throw Error("It's not your turn")
    }
    if (GameParameter.currentBid !== 0) {
        await drawCard(userName)
        return
    }

    GameParameter.turn = await getOtherUser(userName)

    await GameParameter.save()
    await Card.findOneAndUpdate({name: userName}, {drewCard: false})
}

const createRandomCard = (count = 1) => {
    let cardStack = []
    for (let i = 0; i < count; i++) {
        let randomNumber = Math.floor(Math.random() * 120) //112
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
            const randomTextNumber = Math.floor(Math.random() * 12)
            randomTextNumber < 10 ? text = randomTextNumber.toString() : text = "Combo!"
        } else {
            const textValues = ["+2", "+4", "Wild"]
            text = textValues[Math.floor(Math.random() * 3)]
        }
        cardStack.push({color, text})
    }
    return cardStack
}

const validatePlayedCard = ({userInfo, playedCard, gameParameters}) => {

    if (gameParameters.turn !== userInfo.name) {
        throw Error("It's not your turn")
    }

    const userHasTheCard = userInfo.cards.find(element => {
        return playedCard.color === element.color &&
            playedCard.text === element.text;
    })

    if (!userHasTheCard) {
        throw Error("Don't cheat play fair")
    }

    if (playedCard.color !== "Black" && playedCard.text !== gameParameters.cardOnBoard.text && playedCard.color !== gameParameters.cardOnBoard.color) {
        throw Error("You cannot play this card")
    }
}

const getOtherUser = async (userName) => {
    const GameParameter = await GameParameters.findOne({})
    return GameParameter.players.filter((name) => {
        return name !== userName
    })[0]


}

const makeTurn = () => {
    return Math.floor(Math.random() * 2)
}

const createPlayer = async (userName) => {
    try {
        const GameParameter = await GameParameters.findOne({})
        if (GameParameter.players.length < 2) {
            GameParameter.players.push(userName)
        }

        await GameParameter.save()

        return GameParameter.players.length === 2

    } catch (e) {
        await GameParameters.create({players: userName})
        return false
    }


}

const isGameOver = async (userName) => {
    // Check if any of the players hand is empty after a move
    const userHandSize = (await Card.findOne({name: userName})).cards.length

    if (userHandSize !== 0) {
        return false
    }

    // Save/Remove previous game cards
    const GameParameter = await GameParameters.findOne({})
    await GameParameter.collection.drop()
    await Card.collection.drop()

    return true
}

const getGameDetails = async (userName) => {
    const GameParameter = await GameParameters.findOne({})

    const cardOnBoard = GameParameter.cardOnBoard
    const turn = GameParameter.turn
    const otherUser = await getOtherUser(userName)


    const handSize = (await Card.findOne({name: otherUser})).cards.length
    const user = (await Card.findOne({name: userName})).cards

    return {cardOnBoard, turn, handSize, user}
}



module.exports = {drawCard, isGameOver, getGameDetails, makeMove, createPlayer, startGame, passTurn}