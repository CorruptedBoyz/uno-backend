const {Server} = require('socket.io')
const {createPlayer,passTurn, drawCard, makeMove, getGameDetails, startGame, isGameOver} = require('./controllers/game')


async function sendGameDetail(socket,type) {
    const data = await getGameDetails(socket.data.userName)

    switch (type){
        case 'start':
            try {
                socket.emit('start game', data);
            } catch (e) {
                socket.emit('error',e.message)
            }
            break;

        case 'update':
            try {
                socket.emit('game', data)
            } catch (e) {
                socket.emit('error',e.message)
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
                socket.data.userName = data.userName
                sockets.push(socket)
                if (createPlayer(data.userName)) {
                    await startGame()
                    sockets.forEach(item => sendGameDetail(item,'start'))
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('make move', async (data) => {
            try {
                await makeMove(socket.data.userName, data.card)
                if (await isGameOver(socket.data.userName)) {
                    socket.emit('game over', `Game Over ${data.userName} wins`)
                } else {
                    sockets.forEach(item => sendGameDetail(item,'update'))
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('draw card', async () => {
            try {
                await drawCard(socket.data.userName)
                sockets.forEach(item => sendGameDetail(item,'update'))
            } catch (e) {
                socket.emit('error',e.message)
            }
        })
        socket.on('pass turn', async ()=>{
            try{
                await passTurn(socket.data.userName)
                sockets.forEach(item => sendGameDetail(item,'update'))
            }
            catch (e){
                socket.emit('error',e.message)
            }
        })
    })
}


module.exports = socketServer