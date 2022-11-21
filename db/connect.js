const mongoose = require('mongoose')

const connectDb = async (url) => {
     return mongoose.connect(url).then(()=>console.log("Connected to DB"))
}
module.exports = connectDb