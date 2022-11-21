const express = require('express')
require('dotenv').config()
const http = require('http')
const socketServer = require('./socket')
const connectDb = require('./db/connect')
const routes = require('./routes/routes')

const app = express()

app.use(express.json())

const server =http.createServer(app)

socketServer(server);

app.use('/', routes)


const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.DB_URL)
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });

    } catch (error) {
        console.log(error);
    }
};


start();
