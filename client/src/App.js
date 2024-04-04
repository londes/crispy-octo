import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'

import TodoList from './components/TodoList';

import { fetchTodos, postToTodos } from './services/requests.js'

function App() {

  let [todoItems, setTodoItems] = useState([])
  let [task, setTask] = useState({
    todo: '',
    completed: false,
    editing: false,
    editValue: ''
  })

  let changeHandler = e => {
    setTask({...task, todo: e.target.value})
  }
  
  let submitHandler = e => {
    e.preventDefault()
    if (task.todo !== '') {
      postToTodos('/add', task).then(()=>{
        setTodoItems([...todoItems, task])
        setTask({...task, todo: ''})
      })
    }
  }

  let completeHandler = e => {
    let updated = {}
    let completeUpdated = todoItems.map((task, idx) => {
      if (idx == e.target.attributes.idx.value) {
        task.completed = !task.completed
        updated = task
      }
      return task
    })
    postToTodos('/update', updated).then(() => setTodoItems(completeUpdated))
  }

  let removeHandler = e => {
    let removeTarget = {}
    let removeUpdated = todoItems.filter((task, idx) => {
      if (!(e.target.attributes.idx.value == idx)) {
        return true
      } else {
        removeTarget = task
        return false
      }
    })
    postToTodos('/delete', removeTarget).then(()=>setTodoItems(removeUpdated))
  }

  let updateHandler = e => {
    let edited = {}
    let updateEdited = todoItems.map((task, idx) => {
      if (idx == e.target.attributes.idx.value) {
        task.editing = !task.editing
        edited = task
      }
      return task
    })
    postToTodos('/update', edited).then(()=>setTodoItems(updateEdited))
  }

  useEffect(() => {
    fetchTodos().then(todos => setTodoItems(todos))
  }, [])

  return (
    <div className="App">
      <div className="input-container">
        <form onSubmit={submitHandler}>
          <input placeholder='todo' onChange={changeHandler} value={task.todo}/>
          <button>submit</button>
        </form>
      </div>
      <div className="todo-container">
        <TodoList todos={todoItems} complete={completeHandler} remove={removeHandler} update={updateHandler} change={changeHandler}/>
      </div>
    </div>
  );
}

export default App;
