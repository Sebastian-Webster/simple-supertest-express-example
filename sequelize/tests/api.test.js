const supertest = require('supertest')
const app = require('../app')

const User = require('../models/User.js')

const {expect, beforeAll, afterEach, afterAll} = require('@jest/globals')

const dbConnection = require('../config/db')

beforeAll(async () => {
  await User.sync();
})

afterEach(async () => {
  await User.destroy({truncate: true})
})

afterAll(async () => {
  await dbConnection.close()
})

const userToCreate = {
  email: "seb@gmail.com",
  password: 'very secure password',
  username: 'seb'
}

describe('User Route Tests', () => {
  test('Getting all users', async () => {
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