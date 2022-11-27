const mongoose = require('mongoose')


const CardSchema = new mongoose.Schema({
    color: {
        type: String,
        enum: ["Red", "Yellow", "Blue", "Green", "Black"],
        required: false
    },
    text: {
        type: String,
        required: false
    },
    user: {
        type: String,
        required:true
    }
})

/// Random card generate
CardSchema.pre('save', function () {
    let randomNumber = Math.floor(Math.random() * 112)
    let pickedCardColor;
    let pickedCardText;

    if (randomNumber < 25) {
        pickedCardColor = "Red"
    } else if (randomNumber < 50) {
        pickedCardColor = "Yellow"
    } else if (randomNumber < 75) {
        pickedCardColor = "Green"
    } else if (randomNumber < 100) {
        pickedCardColor = "Blue"
    } else {
        pickedCardColor = "Black"
    }
    if (pickedCardColor !== "Black") {
        pickedCardText = Math.floor(Math.random() * 10).toString()
    } else {
        const textValues = ["+2", "+4", "Wild"]
        pickedCardText = textValues[Math.floor(Math.random() * 3)]
    }
    this.color = pickedCardColor
    this.text = pickedCardText
})

module.exports = mongoose.model('Card', CardSchema)
