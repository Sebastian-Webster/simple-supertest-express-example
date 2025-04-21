const supertest = require('supertest')
const {expect, beforeAll, afterEach, afterAll} = require('@jest/globals');
const { createDB } = require('mysql-memory-server');
const mysql = require('mysql2/promise')

let db;
let connection;
let app;

jest.setTimeout(500_000)

//MySQL does not support Windows on ARM yet. If you are using Windows on ARM, the x64 version of MySQL gets used instead.
const arch = process.arch === 'x64' || (process.platform === 'win32' && process.arch === 'arm64') ? 'x64' : 'arm64';

beforeAll(async () => {
  db = await createDB({
    ignoreUnsupportedSystemVersion: true,
    arch
  })
  connection = await mysql.createConnection({
    database: db.dbName,
    port: db.port,
    host: '127.0.0.1',
    user: db.username
  })
  process.env.DB_NAME = db.dbName
  process.env.DB_USER = db.username
  process.env.DB_PASSWORD = ''
  process.env.DB_HOST = '127.0.0.1'
  process.env.DB_PORT = db.port
  app = require('../app')
})

afterEach(async () => {
  await connection.query('TRUNCATE TABLE users;')
})

afterAll(async () => {
  await connection.close();
  await db.stop();
})

const userToCreate = {
  email: "seb@gmail.com",
  password: 'very secure password',
  username: 'seb'
}

describe('User Route Tests', () => {
  test('Getting all users', async () => {
    const User = require('../models/User')
    await User.sync()

    await User.create(userToCreate)

    const expecting = await User.findAll({raw: true})

    await supertest(app)
    .get('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(response => {
      //Stringify and then parse expecting to convert the ObjectId to a string
      expect(response.body).toEqual(expecting)
    })
  })

  test('Creating a user', async () => {
    const User = require('../models/User')
    await User.sync()

    await supertest(app)
    .post('/')
    .send(userToCreate)
    .expect(200)
    .then(async response => {
      const users = await User.findAll()
      const user = users[0]
      expect(users).toHaveLength(1)
      expect(user.email).toBe(userToCreate.email)
      expect(user.password).toBe(userToCreate.password)
      expect(user.username).toBe(userToCreate.username)
      expect(response.text).toBe('Success')
    })
  })

  test('Updating a user', async () => {
    const User = require('../models/User')
    await User.sync()

    await User.create(userToCreate)

    const newUser = await User.findOne({raw: true})

    newUser.username = 'newusername'

    await supertest(app)
    .put(`/username/${newUser.id}`)
    .send({username: newUser.username})
    .expect(200)
    .then(async response => {
      const user = await User.findOne({where: {id: newUser.id}, raw: true})
      expect(user).toEqual(newUser)
    })
  })

  test('Deleting a user', async () => {
    const User = require('../models/User')
    await User.sync()

    const user = await User.create(userToCreate)

    await supertest(app)
    .delete(`/${user.id}`)
    .expect(200)
    .then(async () => {
      const users = await User.findAll()
      expect(users).toEqual([])
    })
  })
})