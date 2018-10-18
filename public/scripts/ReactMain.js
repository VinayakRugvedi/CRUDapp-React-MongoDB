var tasks

fetch('http://localhost:5000/tasks')
  .then(function(response) {
    return response.json()
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson))
    tasks = myJson
  })

class EnterTask extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      taskName : '',
      key : 0
    }
    this.acceptingTask = this.acceptingTask.bind(this)
    this.readingTask = this.readingTask.bind(this)
  }

  acceptingTask () {
    tasks.push({taskname:this.state.taskName, tasknotes:'',id:this.state.key++, completed:false})
    let thistask = {taskname:this.state.taskName, tasknotes:'',id:this.state.key++, completed:false}
    fetch('http://localhost:5000/tasks', {
      method: "POST",
      body: JSON.stringify(thistask)
    })

    this.setState ({
      taskName : ''
    })
    ReactDOM.render(
      <TasksIncomplete allTasks={tasks}/>,
      document.getElementById('addedTaskContainer')
    )
  }

  readingTask (event) {
    this.setState ({
      taskName : event.target.value
    })
    // Why Why Why..?
    // this.state.taskName = event.target.value
    // console.log(this.state.taskName)
    // console.log(event.target.value, 'event target')
  }

  render () {
    return (
      <div>
      <input type="text" placeholder="Add Task and Stop Procrastinating" value={this.state.taskName} onChange={this.readingTask}/>
      <button onClick={this.acceptingTask}>&#10010;</button>
      </div>
    )
  }
}

class EachTask extends React.Component {
  constructor (props) {
    super (props) // Class components should always call the base constructor with props.
    this.state = {
      isDisabled : true,
      taskData : this.props.taskName,
      taskNotesData : this.props.taskNotes,
      isHidden : true,
      displayNotes : 'none',
      edit : '\u270E',
      save : '\u{0270C}'
    }
    this.enableEditing = this.enableEditing.bind(this)
    this.toggleTask = this.toggleTask.bind(this)
    this.editing = this.editing.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addNotes = this.addNotes.bind(this)
    this.saveNotes = this.saveNotes.bind(this)
  }

  enableEditing () {
    console.log("edit")
    this.setState({
      isDisabled : !this.state.isDisabled
    })
  }

  editing (event) {
    this.setState ({
      taskData : event.target.value
    })
    //Filter
    for(let task of tasks) {
      if(task.id === this.props.taskId) {
        task.taskname = event.target.value
        break
      }
    }
  }

  toggleTask () {
    for(let task of tasks) {
      if(task.id === this.props.taskId) {
        task.completed = !task.completed
        break
      }
    }
    this.renderAgain()
  }

  deleteTask () {
    for(let task of tasks) {
      if(task.id === this.props.taskId) {
        tasks.splice(tasks.indexOf(task), 1)
        fetch(`http://localhost:5000/tasks/${task.id}`, {
          method: "DELETE"
        })
        break
      }
    }
    this.renderAgain()
  }

  addNotes () {
    if( this.state.isHidden ) {
      this.setState ({
        displayNotes : ''
      })
    }
    else {
      this.setState ({
        displayNotes : 'none'
      })
    }
    this.setState ({
      isHidden : !this.state.isHidden
    })
    //Ternary
  }

  saveNotes (event) {
    this.setState ({
      taskNotesData : event.target.value
    })
    for(let task of tasks) {
      if(task.id === this.props.taskId) {
        task.tasknotes = event.target.value
        break
      }
    }
  }

  renderAgain() {
    ReactDOM.render(
      <TasksIncomplete allTasks={tasks}/>,
      document.getElementById('addedTaskContainer')
    )
    ReactDOM.render(
      <TasksCompleted allTasks={tasks}/>,
      document.getElementById('completedTaskContainer')
    )
  }

  render () {
    return (
      <div className="container">
      <input type="text" value={this.state.taskData} onChange={this.editing} disabled={this.state.isDisabled}/>
      <button onClick={this.enableEditing}>&#9998;</button>
      <button onClick={this.addNotes}>&#128221;</button>
      <textarea placeholder="Your Notes Here..." value={this.state.taskNotesData} onChange={this.saveNotes} style={{display : this.state.displayNotes}}></textarea>
      <button onClick={this.toggleTask}>&#10004;</button>
      <button onClick={this.deleteTask}>&#10006;</button>
      </div>
    )
  }
}

function TasksIncomplete (props) {
  var tasksToBeRendered = props.allTasks.map( function (task) {
    if (!task.completed) {
      return (
        <EachTask taskName={task.taskname} taskNotes={task.tasknotes} taskId={task.id} key={task.id}/>
      )
    }
  })
    return (
      <div>
      <h3>Tasks Yet to be Done! - &darr;</h3>
      {tasksToBeRendered}
      </div>
    )
  }

  function TasksCompleted (props) {
    var tasksToBeRendered = props.allTasks.map( function (task) {
      if (task.completed) {
        return (
          <EachTask taskName={task.taskname} taskNotes={task.tasknotes} taskId={task.id} key={task.id}/>
        )
      }
    })
    return (
      <div>
      <h3>Completed Tasks... - &darr;</h3>
      {tasksToBeRendered}
      </div>
    )
  }

  ReactDOM.render(
    <EnterTask/>,
    document.getElementById('getTask')
  )
  ReactDOM.render(
    <TasksIncomplete allTasks={tasks}/>,
    document.getElementById('addedTaskContainer')
  )
  ReactDOM.render(
    <TasksCompleted allTasks={tasks}/>,
    document.getElementById('completedTaskContainer')
  )
