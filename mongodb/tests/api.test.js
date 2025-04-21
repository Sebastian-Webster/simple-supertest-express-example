const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const app = require('../app')

const User = require('../models/User')

let database;

const {expect, beforeAll, afterEach, afterAll} = require('@jest/globals')

//MongoDB does not support Windows on ARM yet. If you are using Windows on ARM, the x64 version of MySQL gets used instead.
const arch = process.arch === 'x64' || (process.platform === 'win32' && process.arch === 'arm64') ? 'x64' : 'arm64';

beforeAll(async () => {
  database = await MongoMemoryServer.create({binary: {arch}});
  const uri = database.getUri();
  console.log(uri)
  await mongoose.connect(uri)
})

afterEach(async () => {
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await database.stop()
})

jest.setTimeout(500_000)

const userToCreate = {
  email: "seb@gmail.com",
  password: 'very secure password',
  username: 'seb'
}

describe('User Route Tests', () => {
  test('Getting all users', async () => {
    await new User(userToCreate).save();

    const expecting = await User.find({}).lean()

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
    await supertest(app)
    .post('/')
    .send(userToCreate)
    .expect(200)
    .then(async response => {
      const users = await User.find({}).lean();
      const user = users[0]
      expect(users).toHaveLength(1)
      expect(user.email).toBe(userToCreate.email)
      expect(user.password).toBe(userToCreate.password)
      expect(user.username).toBe(userToCreate.username)
      expect(response.text).toBe('Success')
    })
  })

  test('Updating a user', async () => {
    const newUser = (await new User(userToCreate).save()).toObject()

    newUser.username = 'newusername'

    await supertest(app)
    .put(`/username/${newUser._id}`)
    .send({username: newUser.username})
    .expect(200)
    .then(async response => {
      const user = await User.findOne({_id: {$eq: newUser._id}}).lean();
      expect(user).toEqual(newUser)
    })
  })

  test('Deleting a user', async () => {
    const user = await new User(userToCreate).save();

    await supertest(app)
    .delete(`/${user._id}`)
    .expect(200)
    .then(async () => {
      const users = await User.find({}).lean();
      expect(users).toEqual([])
    })
  })
})