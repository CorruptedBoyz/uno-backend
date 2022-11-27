const {Server} = require('socket.io')
const Game = require('./controllers/game')
const Card = require('./models/card')
                                                         // TODO - Send data to "Game"
function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", methods: ["GET", "POST"]
        }
    })
    let sockets = []

    io.on("connection", (socket) => {

        console.log("Socket connected")

        socket.on('set User', (data) => {
            try {
                socket.data.userName = data.userName;
                sockets.push(socket)
                socket.emit('info', `Your name is ${data.userName}`)
                // if (Game.createUser(data.name)) {
                //     sockets.map(socket => socket.emit('game', JSON.stringify(Game.getGameDetails(socket.data.name))));
                // }

            } catch (e) {
                socket.emit('error', e.message)
            }
        })
        socket.on('game start', (data) => {
            try {
                console.log("Game Started")
            } catch (e) {
                socket.emit('error', e.message)
            }
        })
        socket.on('disconnect', async () => {
            await Card.deleteMany()
        })
    })
}

module.exports = socketServer