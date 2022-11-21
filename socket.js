const {Server} = require('socket.io')

const sockets = [];

function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        socket.on('set User', (data) => {
            try {
                socket.data.userName = data.userName;
                sockets.push(socket);
                socket.emit('info', `Your name is ${data.userName}`)
                console.log("Socket connected")
            } catch (e) {
                socket.emit('error', e.message)
            }
        })
        socket.on('')
    })
}

module.exports = socketServer