const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const taskRoutes = require('./api/router/tasks')

mongoose.connect('mongodb+srv://vinayak:' + process.env.MONGO_ATLAS_PW + '@cluster0-synfk.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
}
)

app.use(cors())
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json())

app.use(express.static('public'))
app.use('/tasks', taskRoutes)

app.use((req, res, next) => {
  const error = new Error('Not Found!')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    message: error.message
  })
})

module.exports = app
