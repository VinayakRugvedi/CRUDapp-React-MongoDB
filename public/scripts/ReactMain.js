var tasks = []

const request = async () => {
    const response = await fetch('http://localhost:5000/tasks');
    const json = await response.json();
    tasks = json
    console.log(tasks, 'tasks obtained initially');
    ReactDOM.render(
      <TasksIncomplete allTasks={tasks}/>,
      document.getElementById('addedTaskContainer')
    )
    ReactDOM.render(
      <TasksCompleted allTasks={tasks}/>,
      document.getElementById('completedTaskContainer')
    )
}
request();

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
    fetch('http://localhost:5000/tasks/', {
      method: "POST",
      body: JSON.stringify({taskname:this.state.taskName, tasknotes:'', completed:false}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(Json => {
      console.log(Json)
      tasks.push({taskname:this.state.taskName, tasknotes:'', _id:Json.createdTask._id, completed:false})
      this.setState ({
        taskName : ''
      })
      ReactDOM.render(
        <TasksIncomplete allTasks={tasks}/>,
        document.getElementById('addedTaskContainer')
      )
    })
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
      // save : '\u{0270C}'
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
      if(task._id === this.props.taskId) {
        task.taskname = event.target.value
        fetch('http://localhost:5000/tasks/' + task._id, {
          method: "POST",
          body: JSON.stringify([{
            propName: 'taskname',
            propValue: task.taskname
          }]),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then( response => response.json())
          .then(Json => console.log(Json))
        break
      }
    }
  }

  toggleTask () {
    for(let task of tasks) {
      if(task._id === this.props.taskId) {
        task.completed = !task.completed
        break
      }
    }
    this.renderAgain()
  }

  deleteTask () {
    for(let task of tasks) {
      if(task._id === this.props.taskId) {
        console.log(task._id, 'task being deleted')
        tasks.splice(tasks.indexOf(task), 1)
        fetch('http://localhost:5000/tasks/', {
          method: "DELETE",
          body : JSON.stringify({taskId:task._id}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(Json => {
          console.log(Json)
          this.renderAgain()
        })
        break
      }
    }
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
      if(task._id === this.props.taskId) {
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
        <EachTask taskName={task.taskname} taskNotes={task.tasknotes} taskId={task._id} key={task._id}/>
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
          <EachTask taskName={task.taskname} taskNotes={task.tasknotes} taskId={task._id} key={task._id}/>
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
