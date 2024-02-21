import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
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
    let removeUpdated = todoItems.filter((task, idx) => {
      if (!(e.target.attributes.idx.value == idx))
        return true
    })
    console.log(removeUpdated)
    setTodoItems(removeUpdated)
  }

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

export default App;
