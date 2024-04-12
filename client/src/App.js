import './App.css';
import React, { useState, useEffect, useRef } from 'react'

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
    setTask({...task, [e.target.attributes.indic.value]: e.target.value})
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
    let pressType = e.target.attributes.indic.value
    let edited = {}

    let updateEdited = todoItems.map((todo, idx) => {
      if (idx == e.target.attributes.idx.value) {
        todo.editing = !todo.editing
        if (pressType == 'done')
          todo.todo = task.editValue
        edited = todo
      }
      return todo
    })
    console.log(edited)
    postToTodos('/update', edited).then(()=>setTodoItems(updateEdited))
  }

  // dragging functionality

  // save reference for dragged item
  let dragItem = useRef(null)
  let dragOverItem = useRef(null)

  // handle sorting
  let handleSort = () => {
    console.log('in our handle sort')
    let _todos = [...todoItems]
    let draggedTodo = _todos.splice(dragItem.current, 1)[0]
    console.log(draggedTodo)
    _todos.splice(dragOverItem.current, 0, draggedTodo)
    console.log(_todos)
    setTodoItems(_todos)
    console.log(todoItems)
    dragItem.current = null
    dragOverItem.current = null
  }

  // drag handlers
  let onDragStart = (e, idx) => dragItem.current = idx
  let onDragEnter = (e, idx) => dragOverItem.current = idx

  useEffect(() => {
    fetchTodos().then(todos => setTodoItems(todos))
  }, [])

  return (
    <div className="App">
      <div className="input-container">
        <form onSubmit={submitHandler}>
          <input indic='todo' placeholder='todo' onChange={changeHandler} value={task.todo}/>
          <button>submit</button>
        </form>
      </div>
      <div className="todo-container">
        <TodoList task={task} todos={todoItems} complete={completeHandler} remove={removeHandler} update={updateHandler} change={changeHandler} dragStart={onDragStart} dragEnter={onDragEnter} dragEnd={handleSort}/>
      </div>
    </div>
  );
}

export default App;
