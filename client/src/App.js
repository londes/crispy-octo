import './App.css';
import React, { useState, useEffect, useRef } from 'react'

import TodoList from './components/TodoList';
import { fetchTodos, addTodo, deleteTodo, updateTodos } from './services/requests.js'

function App() {

  let [todoItems, setTodoItems] = useState([])
  let [task, setTask] = useState({
    todo: '',
    completed: false,
    editing: false,
    editValue: '',
  })

  let changeHandler = e => {
    setTask({...task, [e.target.attributes.indic.value]: e.target.value})
  }
  
  let submitHandler = e => {
    e.preventDefault()
    if (task.todo !== '') {
      addTodo(task).then(()=>{
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
    updateTodos([updated]).then(() => setTodoItems(completeUpdated))
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
    deleteTodo(removeTarget).then(()=>setTodoItems(removeUpdated))
  }

  let editHandler = e => {
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
    updateTodos([edited]).then(()=>setTodoItems(updateEdited))
  }

  // dragging functionality

  // save reference for dragged item
  let dragItem = useRef(null)
  let dragOverItem = useRef(null)

  // handle sorting
  let handleSort = () => {
    // copy to avoid accidentally mutating todoItems
    let _todos = [...todoItems]
    // remove the dragged item
    let draggedTodo = _todos.splice(dragItem.current, 1)[0]
    // insert dragged item at hover location 
    _todos.splice(dragOverItem.current, 0, draggedTodo)
    // update todoItems
    setTodoItems(_todos)
    // reset our references for a new drag
    dragItem.current = null
    dragOverItem.current = null
    console.log(_todos)
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
        <TodoList task={task} todos={todoItems} complete={completeHandler} remove={removeHandler} edit={editHandler} change={changeHandler} dragStart={onDragStart} dragEnter={onDragEnter} dragEnd={handleSort}/>
      </div>
    </div>
  );
}

export default App;
