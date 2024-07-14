const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to database')
}).catch(error => {
  console.error(error)
  process.exit(1)
})