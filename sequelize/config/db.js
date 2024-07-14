const { Sequelize } = require('sequelize');

const sequelize = process.env.isATest
? new Sequelize('sqlite::memory:')
: new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: 'mysql'})

async function connect() {
  try {
    sequelize.authenticate();
    console.log('Database successfully connected')
  } catch (error) {
    console.error('An error occurred while connecting to the database:', error)
    process.exit(1)
  }
}

connect()

module.exports = sequelize