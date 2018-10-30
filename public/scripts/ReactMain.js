class EnterTask extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      taskName : ''
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
      .then(json => {
      this.props.updateTasks({taskname:this.state.taskName, tasknotes:'', _id:json.createdTask._id, completed:false})
      this.setState ({
        taskName : ''
      })
    })
  }

  readingTask (event) {
    this.setState ({
      taskName : event.target.value
    })
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
    }
    this.tasks = [...this.props.tasks]
    this.enableEditing = this.enableEditing.bind(this)
    this.toggleTask = this.toggleTask.bind(this)
    this.editing = this.editing.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addNotes = this.addNotes.bind(this)
    this.saveNotes = this.saveNotes.bind(this)
    this.fetchCall = this.fetchCall.bind(this)
  }

  fetchCall(bodyOfRequest, Id = '') {
    fetch('http://localhost:5000/tasks/' + Id, {
      method: "POST",
      body: bodyOfRequest,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then( response => response.json())
      .then(
        json => {
          console.log(json)
          this.props.reInitializeTasks(this.tasks)
        }
      )
  }

  enableEditing () {
    this.setState({
      isDisabled : !this.state.isDisabled
    })
  }

  editing (event) {
    this.setState ({
      taskData : event.target.value
    })
    //Filter
    for(let task of this.tasks) {
      if(task._id === this.props.taskId) {
        task.taskname = event.target.value //never hardcode urls
        this.fetchCall(JSON.stringify({'taskname': task.taskname}), task._id)
        break
      }
    }
  }

  toggleTask () {
    for(let task of this.tasks) {
      if(task._id === this.props.taskId) {
        task.completed = !task.completed
        fetch('http://localhost:5000/tasks/' + task._id, {
          method: "POST",
          body: JSON.stringify({
            'completed': task.completed
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then( response => response.json())
          .then(
            json => {
              console.log(json)
              this.props.reInitializeTasks(this.tasks)
            }
          )
        break
      }
    }
  }

  deleteTask () {
    for(let task of this.tasks) {
      if(task._id === this.props.taskId) {
        this.tasks.splice(this.tasks.indexOf(task), 1)
        fetch('http://localhost:5000/tasks/', {
          method: "DELETE",
          body : JSON.stringify({taskId:task._id}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(
          json => {
            console.log(json)
            this.props.reInitializeTasks(this.tasks)
          }
        )
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
    for(let task of this.tasks) {
      if(task._id === this.props.taskId) {
        task.tasknotes = event.target.value
        fetch('http://localhost:5000/tasks/' + task._id, {
          method: "POST",
          body: JSON.stringify({
           'tasknotes': task.tasknotes
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then( response => response.json())
          .then(
            json => {
              console.log(json)
              this.props.reInitializeTasks(this.tasks)
            }
          )
        break
      }
    }
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

  function Tasks(props) {
    var tasksToBeRendered = props.Tasks.map( function (task) {
        return (
          <EachTask tasks={props.Tasks} taskName={task.taskname} taskNotes={task.tasknotes} taskId={task._id} key={task._id} reInitializeTasks={props.reInitializeTasks}/>
        )
    })
    return (
      <div>
      {tasksToBeRendered}
      </div>
    )
  }

  class MainComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        tasks : [],
      }
      this.updateTasks = this.updateTasks.bind(this)
      this.reInitializeTasks = this.reInitializeTasks.bind(this)
    }

    componentWillMount() {
        var tasksFromDB
        fetch('http://localhost:5000/tasks').then(
          response => response.json()
        ).then(
          json => {
            tasksFromDB = json
            this.setState({
              tasks : [...tasksFromDB] // Check it man
            })
          }
        )
    }

    updateTasks(task) {
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }

    reInitializeTasks(tasks) {
      this.setState({
        tasks : [...tasks]
      })
    }

    render() {
        var incompleteTasks = [], completedTasks = []
        for( let task of this.state.tasks) {
          if(!task.completed) {
            incompleteTasks.push(task)
          }
          else {
            completedTasks.push(task)
          }
        }
      return (
        <div>
        <div id="getTask">
        <EnterTask updateTasks={this.updateTasks}/>
        </div>
        <div id="addedTaskContainer">
        <h3>Tasks Yet to be Done! - &darr;</h3>
        <Tasks Tasks={incompleteTasks} reInitializeTasks={this.reInitializeTasks}/>
        </div>
        <div className="vertLine"></div>
        <div id="completedTaskContainer">
        <h3>Completed Tasks... - &darr;</h3>
        <Tasks Tasks={completedTasks} reInitializeTasks={this.reInitializeTasks}/>
        </div>
        </div>
      )
    }
  }

  ReactDOM.render(
    <MainComponent/>,
    document.getElementById('mainwrapper')
  )

// How to not hardcode urls..?
// Make less access to DB i.e using event.target.value
// Use event object more effectively
