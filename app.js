const express = require('express')
require('dotenv').config()
const http = require('http')
const socketServer = require('./socket')
const connectDb = require('./db/connect')
const {startGame, drawCard, isGameOver, makeMove} = require("./controllers/game");

const app = express()

app.use(express.json())

const server =http.createServer(app)

socketServer(server);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.DB_URL)
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
        // await isGameOver(0)
        // await startGame("Erce","Mete")
        // await drawCard("Mete")
        // await makeMove("Mete",{color:"Yellow",text:1})
    } catch (error) {
        console.log(error);
    }
};

start();