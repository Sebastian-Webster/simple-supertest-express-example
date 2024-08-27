const supertest = require('supertest')
const sql = require('mysql2/promise')
const {expect, beforeAll, afterAll, afterEach} = require('@jest/globals');
const { createDB } = require('mysql-memory-server');

const userToCreate = {
  email: "seb@gmail.com",
  password: 'very secure password',
  username: 'seb'
}

let db;
let connection;

beforeAll(async () => {
  db = await createDB()
  connection = await sql.createConnection({
    host: '127.0.0.1',
    user: db.username,
    port: db.port,
    database: db.dbName
  })
  process.env.host = '127.0.0.1';
  process.env.user = db.username;
  process.env.port = db.port;
  process.env.password = '';
  process.env.database_name = db.dbName;
})

afterEach(async () => {
  await connection.query('TRUNCATE TABLE users;')
})

afterAll(async () => {
  await connection.close()
  await db.stop()
})

function createUser() {
  return new Promise(async resolve => {
    const result = await connection.query('INSERT INTO users(email, username, password) VALUES (?, ?, ?);', [userToCreate.email, userToCreate.username, userToCreate.password])
    const insertedId = result[0].insertId
    const query = await connection.query('SELECT * FROM users WHERE id=?', [insertedId])
    return resolve(query[0][0])
  })
}

async function findUserById(id) {
  return (await connection.query('SELECT * FROM users WHERE id=?', [id]))[0][0]
}

async function findUsers() {
  const query = await connection.query('SELECT * FROM users')
  return query[0]
}

jest.setTimeout(100_000)

describe('User Route Tests', () => {
  test('Getting all users', async () => {
    const app = await require('../app')()
    await createUser()

    const expecting = await findUsers()

    await supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      //Stringify and then parse expecting to convert the ObjectId to a string
      expect(response.body).toEqual(JSON.parse(JSON.stringify(expecting)))
    })
  })

  test('Creating a user', async () => {
    const app = await require('../app')()
    await supertest(app)
    .post('/')
    .send(userToCreate)
    .expect(200)
    .then(async response => {
      const users = (await connection.query('SELECT * from users;'))[0]
      const user = users[0]
      expect(users).toHaveLength(1)
      expect(user.email).toBe(userToCreate.email)
      expect(user.password).toBe(userToCreate.password)
      expect(user.username).toBe(userToCreate.username)
      expect(response.text).toBe('Success')
    })
  })

  test('Updating a user', async () => {
    const app = await require('../app')()
    const newUser = await createUser()
  
    newUser.username = 'newusername'
  
    await supertest(app)
    .put(`/username/${newUser.id}`)
    .send({username: newUser.username})
    .expect(200)
    .then(async () => {
      const user = await findUserById(newUser.id)
      expect(user).toEqual(newUser)
    })
  })
  
  test('Deleting a user', async () => {
    const app = await require('../app')()
    const user = await createUser()
  
    await supertest(app)
    .delete(`/${user.id}`)
    .expect(200)
    .then(async () => {
      const users = await findUsers()
      expect(users).toEqual([])
    })
  })
})