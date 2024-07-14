const Models = require('../models/index.js')

function createUser(req, res) {
  Models.User.create(req.body).then(() => {
    res.send('Success')
  }).catch(error => {
    console.error('An error occurred while creating user:', error)
    res.status(500).send('An error occurred.')
  })
}

function getUsers(req, res) {
  Models.User.findAll({}).then(users => {
    res.json(users)
  }).catch(error => {
    console.error('An error occurred while getting all users:', error)
    res.status(500).send('An error occurred.')
  })
}

function updateUserUsername(req, res) {
  Models.User.findOne({where: {id: req.params.id}}).then(user => {
    if (!user) {
      return res.status(404).send('Could not find user')
    }

    Models.User.update({username: req.body.username}, {where: {id: req.params.id}}).then(() => {
      res.send('Success')
    }).catch(error => {
      console.error('An error occurred while updating user:', error)
      res.status(500).send('An error occurred.')
    })
  })
}

function deleteUser(req, res) {
  Models.User.destroy({where: {id: req.params.id}}).then(() => {
    res.send('Success')
  }).catch(error => {
    console.error('An error occurred while deleting user:', error)
    res.status(500).send('An error occurred.')
  })
}

module.exports = {
  createUser,
  getUsers,
  updateUserUsername,
  deleteUser
}