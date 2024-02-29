import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { URL } from './config'

import TodoList from './components/TodoList';

function App() {

  let [todoItems, setTodoItems] = useState([])
  let [task, setTask] = useState({
    title: '',
    completed: false,
  })

  let changeHandler = e => {
    setTask({...task, title: e.target.value})
  }
  
  let submitHandler = e => {
    e.preventDefault()
    if (task.title !== '') {
      setTodoItems([...todoItems, task])
      setTask({...task, title: ''})
    }
  }

  let completeHandler = e => {
    let completeUpdated = todoItems.map((task, idx) => {
      if (idx == e.target.attributes.idx.value)
        task.completed = !task.completed
      return task
    })
    setTodoItems(completeUpdated)
  }

  let removeHandler = e => {
    let removeTarget = {}
    let removeUpdated = todoItems.filter((task, idx) => {
      if (!(e.target.attributes.idx.value == idx)) {
        removeTarget = task
        return true
      }
    })
    postToTodos('/delete', removeTarget).then(()=>setTodoItems(removeUpdated))
  }

  useEffect(() => {
    fetchTodos().then(todos => setTodoItems(todos))
  }, [])

  return (
    <div className="App">
      <div className="input-container">
        <form onSubmit={submitHandler}>
          <input placeholder='todo' onChange={changeHandler} value={task.title}/>
          <button>submit</button>
        </form>
      </div>
      <div className="todo-container">
        <TodoList todos={todoItems} complete={completeHandler} remove={removeHandler}/>
      </div>
    </div>
  );
}

// set up our requests to the back-end

async function fetchTodos() {
  const res = await fetch(`${URL}/todos`, [])
  if (!res.ok) {
    const message = 'error fetching todos'
    throw new Error(message)
  }
  const todos = await res.json()
  return todos
}

async function postToTodos(url='', data = {}) {
  console.log(data)
  const res = await fetch(`${URL}/todos${url}`, {
    method:"POST",
    mode:"cors",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": 'application/json'
    }
  })
  return res.json()
}

export default App;
