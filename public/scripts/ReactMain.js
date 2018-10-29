// var tasks = []

// const request = async () => {
//     const response = await fetch('http://localhost:5000/tasks');
//     const json = await response.json();
//     tasks = json
//     return tasks
// }
// request();

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
      console.log(this.props, 'in first compo')
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
      // save : '\u{0270C}'
    }
    this.tasks = [...this.props.tasks]
    this.enableEditing = this.enableEditing.bind(this)
    this.toggleTask = this.toggleTask.bind(this)
    this.editing = this.editing.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addNotes = this.addNotes.bind(this)
    this.saveNotes = this.saveNotes.bind(this)
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
        fetch('http://localhost:5000/tasks/' + task._id, {
          method: "POST",
          body: JSON.stringify({
            'taskname': task.taskname
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

function TasksIncomplete (props) {
  console.log(props.allTasks, 'in tasksincomplete')
  var tasksToBeRendered = props.allTasks.map( function (task) {
    if (!task.completed) {
      return (
        <EachTask tasks={props.allTasks} taskName={task.taskname} taskNotes={task.tasknotes} taskId={task._id} key={task._id} reInitializeTasks={props.reInitializeTasks}/>
      )
    }
  })
    return (
      <div>
      {tasksToBeRendered}
      </div>
    )
  }

  function TasksCompleted (props) {
    var tasksToBeRendered = props.allTasks.map( function (task) {
      if (task.completed) {
        return (
          <EachTask tasks={props.allTasks} taskName={task.taskname} taskNotes={task.tasknotes} taskId={task._id} key={task._id} reInitializeTasks={props.reInitializeTasks}/>
        )
      }
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
            console.log(tasksFromDB,'from DB')
            this.setState({
              tasks : [...tasksFromDB] // Check it man
            })
          }
        )
    }

    updateTasks(task) {
      // console.log(task, 'called')
      this.setState({
        tasks: [...this.state.tasks, task]
      })
      // console.log(this.state.tasks, 'state')
    }

    reInitializeTasks(tasks) {
      this.setState({
        tasks : [...tasks]
      })
    }

    render() {
      return (
        <div>
        <div id="getTask">
        <EnterTask updateTasks={this.updateTasks}/>
        </div>
        <div id="addedTaskContainer">
        <h3>Tasks Yet to be Done! - &darr;</h3>
        <TasksIncomplete allTasks={this.state.tasks} reInitializeTasks={this.reInitializeTasks}/>
        </div>
        <div className="vertLine"></div>
        <div id="completedTaskContainer">
        <h3>Completed Tasks... - &darr;</h3>
        <TasksCompleted allTasks={this.state.tasks} reInitializeTasks={this.reInitializeTasks}/>
        </div>
        </div>
      )
    }
  }

  ReactDOM.render(
    <MainComponent/>,
    document.getElementById('mainwrapper')
  )
