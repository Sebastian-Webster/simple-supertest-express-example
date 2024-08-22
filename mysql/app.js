const express = require('express')
const cors = require('cors')

async function main() {
    const getConnection = require('./config/db')
    const connection = await getConnection();

    await connection.query('CREATE TABLE IF NOT EXISTS users (id int not null AUTO_INCREMENT, email varchar(255) not null, username varchar(255) not null, password varchar(255) not null, PRIMARY KEY (id));')

    const userRoutes = require('./routes/userRoute')
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use('/', userRoutes)

    return app
}

module.exports = main;