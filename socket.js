const {Server} = require('socket.io')
const {startGame,makeMove,drawCard,GameParameters, Deneme} = require('./controllers/game')
                                                         //TODO - Socket functions - game
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
        socket.on('game start', async (data) => {
            try {
              await startGame(data.user1,data.user2)
            } catch (e) {
                socket.emit('error', e.message)
            }
        })
        socket.on('disconnect', async () => {
            //await Card.deleteMany()
        })

        socket.on('deneme', ()=>{
        Deneme()
        })
    })
}

module.exports = socketServer