const mongoose = require('mongoose')

const configObject = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pwd: process.env.DB_PWD,
    auth: process.env.DB_AUTH_SOURCE
  }
}

mongoose.connect(`mongodb://${configObject.db.host}:${configObject.db.port}/${configObject.db.name}`, {
  user: configObject.db.user,
  pass: configObject.db.pwd,
  authSource: configObject.db.auth
})

module.exports = configObject