const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  taskname: String,
  tasknotes: String,
  id: Number,
  completed: Boolean
})

module.exports = mongoose.model('Task', taskSchema)
