const express = require('express')
const path = require('path')
const cors = require('cors')
require('./db/mongoose')

const usersRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')

const app = express()

app.use(express.json())
app.use(cors())
app.use(usersRouter)
app.use(tasksRouter)

// Define paths for Express config
const publicPath = path.join(__dirname, '../client/dist')

app.use(express.static(publicPath))

module.exports = app
