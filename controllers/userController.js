const User = require('../models/User')

function createUser(req, res) {
  new User(req.body).save().then(() => {
    res.send('Success')
  }).catch(error => {
    console.error(error)
    res.status(500).send('An error occurred')
  })
}

function getUsers(req, res) {
  User.find({}).lean().then(users => {
    console.error(users[0]._id.buffer)
    res.json(users)
  }).catch(error => {
    console.error(error)
    res.status(500).send('An error occurred')
  })
}

function updateUserUsername(req, res) {
  User.findOne({_id: {$eq: req.params.id}}).then(async user => {
    if (!user) {
      return res.status(404).send('Could not find user')
    }

    user.username = req.body.username;
    await user.save()
    res.send('Success')
  }).catch(error => {
    console.error(error)
    res.status(500).send('An error occurred')
  })
}

function deleteUser(req, res) {
  User.deleteOne({_id: {$eq: req.params.id}}).then(() => {
    res.send('Success')
  }).catch(error => {
    console.error(error)
    res.status(500).send('An error occurred')
  })
}

module.exports = {
  createUser,
  getUsers,
  updateUserUsername,
  deleteUser
}