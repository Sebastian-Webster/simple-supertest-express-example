require('dotenv').config()
const getApp = require('./app')

async function main() {
  const app = await getApp();
  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

main()