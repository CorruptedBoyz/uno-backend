const {Server} = require('socket.io')
const {
    createPlayer,
    passTurn,
    drawCard,
    makeMove,
    getGameDetails,
    startGame,
    isGameOver,
} = require('./controllers/game')


async function sendGameDetails(sockets, type) {

    switch (type) {
        case 'start':
            try {
                await startGame()
                sockets.forEach(async item => {
                    const data = await getGameDetails(item.data.userName)
                    item.emit('start game', data)
                })
            } catch (e) {
                sockets.forEach(item => item.emit('error', e.message))
            }
            break;

        case 'update':
            try {
                sockets.forEach(async item => {
                    const data = await getGameDetails(item.data.userName)
                    item.emit('game', data)
                })
            } catch (e) {
                sockets.forEach(item => item.emit('error', e.message))
            }
            break;

        case 'end':
            try {
                sockets.forEach(item => item.emit(`Game over ${item.playerWin}wins!`))
            } catch (e) {
                sockets.forEach(item => item.emit('error', e.message))
            }
            break;
    }
}


function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", methods: ["GET", "POST"]
        }
    })

    let sockets = []

    io.on("connection", (socket) => {
        console.log("Socket connected")

        socket.on('set user', async (data) => {
            try {
                if (sockets.length < 2) {
                    socket.data.userName = data.userName

                    sockets.push(socket)

                    if (await createPlayer(data.userName)) {
                        sendGameDetails(sockets, 'start')
                    }
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('make move', async (data) => {
            try {
                await makeMove(socket.data.userName, data.card)
                if (await isGameOver(socket.data.userName)) {
                    const winner = socket.data.userName
                    sockets.map(item => item.playerWin = winner)
                    sendGameDetails(sockets, 'end')
                } else {
                    sendGameDetails(sockets, 'update')
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('draw card', async () => {
            try {
                await drawCard(socket.data.userName)
                sendGameDetails(sockets, 'update')
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('pass turn', async () => {
            try {
                await passTurn(socket.data.userName)
                sendGameDetails(sockets, 'update')
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('restart game', async () => {
            try {
                sockets.map(async item => await createPlayer(item.data.userName))
                sendGameDetails(sockets, 'start')
            } catch (e) {
                socket.emit('error', e.message)
            }
        })
    })
}


module.exports = socketServer