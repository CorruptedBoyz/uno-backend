const Card = require('../models/card')

const drawCard= async (req,res) => {
    const card = await Card.create({})
    res.status(200).json({card:{color:card.color,text:card.text}})
}




module.exports = {drawCard}