const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Task = require('../models/task')

router.get('/', (req, res, next) => {
  Task.find().exec().then(docs => {
    console.log(docs)
    res.status(200).json(docs)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})

router.post('/', (req, res, next) => {
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    taskname: req.body.taskname,
    tasknotes: req.body.tasknotes,
    id: req.body.id,
    completed: req.body.completed
  })
  task.save().then(result => {
    console.log(result)
    res.status(201).json({
      status: 'true'
    })
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})

router.patch('/:taskId', (req, res, next) => {
  const taskid = req.params.taskId
  const updateOn = {}
  for(let on of req.body) {
    updateOn[on.propName] = on.propValue
  }
  Task.update({id:taskid}, {$set: updateOn}).exec().then(result => {
    console.log(result)
    res.status(200).json(result)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })
  })
})

router.delete('/', (req, res, next) => {
  const taskid = req.body.taskId
  console.log(taskid)
  Task.remove({id:taskid}).exec().then(result => {
    console.log(result)
    res.status(200).json(result)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error:err
    })
  })
})

module.exports = router
