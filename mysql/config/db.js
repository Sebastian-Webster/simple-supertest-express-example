const mysql = require('mysql2/promise')

let cachedConnection;

async function getConnection() {
  if (cachedConnection) {
    return cachedConnection
  }

  const host = process.env.host;
  const user = process.env.user;
  const port = process.env.port;
  const password = process.env.password;
  const database = process.env.database_name;

  cachedConnection = await mysql.createConnection({
    host: host || '127.0.0.1',
    user: user || 'root',
    port: port || 3310,
    password: password || '',
    database: database || 'dbdata'
  })

  return cachedConnection
}

module.exports = getConnection