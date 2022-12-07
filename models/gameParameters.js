const mongoose = require('mongoose')

const GameParameters = new mongoose.Schema({
    turn: {
        type: String,
        required: false
    },
    started: {
        type: Boolean,
        default: false
    },
    players:{
        type:Array,
        player:String,
        required: false
    },
    cardOnBoard:{
        type:Object,
        default:null
    },
    currentBid:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('GameParameters',GameParameters)