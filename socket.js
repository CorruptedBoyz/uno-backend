const {Server} = require('socket.io')
const {createPlayer,passTurn, drawCard, makeMove, getGameDetails, startGame, isGameOver,dropGameParameters} = require('./controllers/game')


async function sendGameDetail(socket,type) {
    const data = await getGameDetails(socket.data.userName)

    switch (type){
        case 'start':
            try {
                socket.emit('start game',data);
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

        case 'end':
            try{
                socket.emit('game over',`Game over ${socket.data.userName} wins!`)
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

    io.on("connection",  (socket) => {
        console.log("Socket connected")
        // await dropGameParameters()
        socket.on('set user', async (data) => {
            try {
                socket.data.userName = data.userName
                sockets.push(socket)
                if (await createPlayer(data.userName)) {
                    await startGame()
                    sockets.map(async item => await sendGameDetail(item,'start'))
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('make move', async (data) => {
            try {
                await makeMove(socket.data.userName, data.card)
                if (await isGameOver(socket.data.userName)) {
                    sockets.map(async item => await sendGameDetail(item,'end'))
                } else {
                    sockets.map(async item =>await sendGameDetail(item,'update'))               // TODO - Sync-Async Test et
                }
            } catch (e) {
                socket.emit('error', e.message)
            }
        })

        socket.on('draw card', async () => {
            try {
                await drawCard(socket.data.userName)
                sockets.map(item => sendGameDetail(item,'update'))
            } catch (e) {
                socket.emit('error',e.message)
            }
        })

        socket.on('pass turn', async ()=>{
            try{
                await passTurn(socket.data.userName)
                sockets.map(item => sendGameDetail(item,'update'))
            }
            catch (e){
                socket.emit('error',e.message)
            }
        })
    })
}


module.exports = socketServer