import './App.css';
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.js';
import Login from './views/Login.js';
import Profile from './views/Profile.js';
import Todos from './views/Todos.js'

import { fetchTodos, addTodo, deleteTodo, updateTodos } from './services/todosRequests.js'
import { fetchUsers, verifyToken } from './services/userRequests.js';

function App() {

  // only reason we are setting logged in to true here is because if false we get some bad flicker on our Profile/Login link, and we check for token right away in our [token] useEffect which happens much faster than waiting for a response from the server
  let [ isLoggedIn, setIsLoggedIn ] = useState(true)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(localStorage.getItem('userId'))

  let [todoItems, setTodoItems] = useState([])
  let [task, setTask] = useState({
    todo: '',
    completed: false,
    editing: false,
    editValue: '',
    index: null
  })

  // let navigate = useNavigate()

  useEffect(()=>{
    const verify_token = async () => {
      try {
        if (!token)
          setIsLoggedIn(false)
        else {
          let res = await verifyToken(token)
          return res.ok ? login(res.succ.userId) : console.log('invalid token')
        }
      } catch (error) {
        console.log(error)
      }
    }
    verify_token()
  }, [isLoggedIn])

  let login = async (userId) => {
   localStorage.setItem('userId', userId)
    setIsLoggedIn(true)
    setToken(token)
  }

  // this used to be handleLogout in our Profile component until we moved it into the parent. should we just move it back? Could avoid making context entirely
  let logout = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken('')
    setUser('')
    setIsLoggedIn(false)
    setTimeout(()=>{
        // tis broken sir
        // navigate('/')
    }, 1000)
}

  let changeHandler = e => setTask({...task, [e.target.attributes.indic.value]: e.target.value})
  
  let submitHandler = e => {
    e.preventDefault()
    if (task.todo !== '') {
      task.index = todoItems.length
      addTodo(task).then(()=>{
        setTodoItems([...todoItems, task])
        setTask({...task, todo: ''})
      })
    }
  }

  let completeHandler = e => {
    let updated = {}
    let completeUpdated = todoItems.map((todo, idx) => {
      if (idx == e.target.attributes.idx.value) {
        todo.completed = !todo.completed
        updated = todo
      }
      return todo
    })
    updateTodos([updated]).then(() => setTodoItems(completeUpdated))
  }

  let removeHandler = e => {
    let removeTarget = {}
    let removeUpdated = todoItems.filter((todo, idx) => {
      if (!(e.target.attributes.idx.value == idx)) {
        return true
      } else {
        removeTarget = todo
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
    updateTodos([edited]).then(()=> {
      setTodoItems(updateEdited)
      setTask({...task, editValue: ''})
    })
  }

  // start -- dragging functionality
  // save reference for dragged item
  let dragItem = useRef(null)
  let dragOverItem = useRef(null)

  // handle sorting on drag and drop
  let dragSortHandler = () => {
    // copy to avoid accidentally mutating todoItems
    let _todos = [...todoItems]
    // create a new arr to store items that moved
    let updated = []
    // remove the dragged item
    let draggedTodo = _todos.splice(dragItem.current, 1)[0]
    // insert dragged item at hover location 
    _todos.splice(dragOverItem.current, 0, draggedTodo)
    // push all of the items which changed location to updated
    _todos.forEach((ele, idx) => {
      if (ele.index !== idx) {
        ele.index = idx
        updated.push(ele)
      }
    })    
    // reset our references for a new drag
    dragItem.current = null
    dragOverItem.current = null
    // update with our altered items, and update todoItems locally
    updateTodos(updated).then(()=>setTodoItems(_todos))
  }

  // drag handlers
  let onDragStart = (e, idx) => dragItem.current = idx
  let onDragEnter = (e, idx) => dragOverItem.current = idx

  // end -- dragging functionality

  useEffect(() => {
    fetchTodos().then(todos => setTodoItems(todos.sort((a,b) => a.index - b.index)))
  }, [])

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={isLoggedIn}/>
        <Routes>
          <Route path='/' element={<Todos task={task} submit={submitHandler} todos={todoItems} complete={completeHandler} remove={removeHandler} edit={editHandler} change={changeHandler} dragStart={onDragStart} dragEnter={onDragEnter} dragEnd={dragSortHandler}/>}/>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
