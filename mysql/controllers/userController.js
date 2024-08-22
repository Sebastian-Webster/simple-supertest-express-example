const getConnection = require('../config/db')

async function createUser(req, res) {
  try {
    const conn = await getConnection()
    await conn.query('INSERT INTO users(email, username, password) VALUES (?, ?, ?);', [req.body.email, req.body.username, req.body.password])
    res.send('Success')
  } catch (e) {
    console.error(e)
    res.status(500).send('An error occurred')
  }
}

async function getUsers(req, res) {
  try {
    const conn = await getConnection()
    const users = (await conn.query('SELECT * FROM users'))[0]
    res.json(users)
  } catch (e) {
    console.error(e)
    res.status(500).send('An error occurred')
  }
}

async function updateUserUsername(req, res) {
  try {
    const conn = await getConnection()
    const userExists = (await conn.query('SELECT * FROM users WHERE id=?', [req.params.id]))[0].length === 1
    if (!userExists) {
      return res.status(404).send('Could not find user')
    }

    await conn.query('UPDATE users SET username=? WHERE id=?', [req.body.username, req.params.id])
    res.send('Success')
  } catch (e) {
    console.error(e)
    res.status(500).send('An error occurred')
  }
}

async function deleteUser(req, res) {
  try {
    const conn = await getConnection()
    await conn.query('DELETE FROM users WHERE id=?', [req.params.id])
    res.send('Success')
  } catch (e) {
    console.error(e)
    res.status(500).send('An error occurred')
  }
}

module.exports = {
  createUser,
  getUsers,
  updateUserUsername,
  deleteUser
}