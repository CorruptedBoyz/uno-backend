const mongoose = require('mongoose')


const CardSchema = new mongoose.Schema({

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
            type: Boolean,      // TODO - ????
            default: false
        }

    }
)


module.exports = mongoose.model('Card', CardSchema)
