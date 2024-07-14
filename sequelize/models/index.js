'use strict';
const User = require('./User')

async function init() {
  await User.sync();
}

init()

module.exports = {
  User
}