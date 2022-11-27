const mongoose = require('mongoose')


const CardSchema = new mongoose.Schema({

    user: {
        name: String,
        cards: {
            type: Array,
            color: {
                type: String,
                enum: ["Red", "Yellow", "Blue", "Green", "Black"],
            },
            text: {
                type: String,
            }
        },
        drewCard: {
            type: Boolean,
            default: false
        }

    }
})

CardSchema.methods.cardDraw = function (card) {
    this.cards.unshift({card})
    this.drewCard=true       // TODO - Add card to players hand
}


module.exports = mongoose.model('Card', CardSchema)
