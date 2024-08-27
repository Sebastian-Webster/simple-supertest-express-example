const mysql = require('mysql2/promise')

let cachedConnection;

async function getConnection() {
  if (cachedConnection) {
    return cachedConnection
  }

  cachedConnection = await mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    port: process.env.port,
    password: process.env.password,
    database: process.env.database_name
  })

  return cachedConnection
}

module.exports = getConnection