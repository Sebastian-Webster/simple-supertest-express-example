const supertest = require('supertest')
const {expect, beforeAll, afterEach, afterAll} = require('@jest/globals');
const { createDB } = require('mysql-memory-server');
const mysql = require('mysql2/promise')

let db;
let connection;

jest.setTimeout(500_000)

beforeAll(async () => {
  db = await createDB({
    ignoreUnsupportedSystemVersion: true
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
})

afterEach(async () => {
  await connection.query('DROP DATABASE dbdata;')
  await connection.query('CREATE DATABASE dbdata;')
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
    const app = require('../app')
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
    const app = require('../app')
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
    const app = require('../app')
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
    const app = require('../app')
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