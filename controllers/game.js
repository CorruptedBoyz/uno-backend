const Card = require('../models/card')

let GameParameters = {
    Turn: String,
    OnGoing: Boolean
}
// const card = await Card.create({user: userName})

const drawCard = async (userName,) => {
    // Check if player already drew a card this turn
    // Create a random card
    // Update player's hand on database
    // Return both players hand
}

                                    //region TODOS
                                    // TODO - Inıt cards
                                    // TODO - Start game
                                    // TODO - Remove from route
                                    //endregion

const startGame = async () => {
    // Create 5 random cards for each player
    // Initialize players hand and write to database
    // Put a random card to the board
}

const makeMove = async (userName, card) => {
    // Check if the card can be played
    // Throw error if not
    // Otherwise update player's hand on database
}

const isGameOver = () => {
    // Check if any of the players hand is empty after a move
    // Set Game.
}


module.exports = {drawCard, startGame, makeMove, isGameOver}