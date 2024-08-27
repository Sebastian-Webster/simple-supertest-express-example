const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: 'mysql', port: process.env.DB_PORT})

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Database successfully connected')
  } catch (error) {
    console.error('An error occurred while connecting to the database:', error)
    process.exit(1)
  }
}

connect()

module.exports = sequelize