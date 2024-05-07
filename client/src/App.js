import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import Navbar from './components/Navbar.js';
import Login from './views/Login.js';
import Profile from './views/Profile.js';
import Todos from './views/Todos.js'

import { fetchTodos } from './services/todosRequests.js'
import { fetchUsers, verifyToken, loginUser } from './services/userRequests.js';
import { addTodo } from './services/todosRequests.js';

function App() {

  let [ isLoggedIn, setIsLoggedIn ] = useState(false)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')))
  let [ todos, setTodos ] =  useState(JSON.parse(localStorage.getItem('todos')))

  // if a user is not logged in, we just want to update todos locally every time they change. otherwise, we just manage todos on the server
  useEffect(() => {
    if (!isLoggedIn)
      localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token)
          logout()
        else {
          let res = await verifyToken(token)
          return res.ok ? login(token) : logout()
        }
      } catch (error) {
        console.log(error)
      }
    }
    verify_token()
  }, [isLoggedIn])

  let login = (token) => {
    // decode token
    let decoded = jwtDecode(token)
    console.log(decoded)
    // parse values we want from our user
    let user = {
      userId: decoded.userId
    }
    // set token and user values to local storage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    // update user login, user, and token state values
    setIsLoggedIn(true)
    setUser(user)
    setToken(token)
    // check for todos on localStorage
    let localTodos = JSON.parse(localStorage.getItem('todos'))
    // if we have todos on local storage on register/login, add them to db for that user
    if (localTodos && localTodos?.length > 0) {
      // we want to add user_id, but remove index (avoids bugs if user has existing todos on login, and index isn't required)
      let newTodos = localTodos.map(todo => {
        let localTodo = { ...todo, user_id: user.userId}
        delete localTodo.index
        return localTodo
      })
      // add our local todos, then fetch and set
      addTodo(newTodos).then(() => fetchTodos(token)).then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
      // remove local todos to avoid this from happening again for a logged in user
      localStorage.setItem('todos', JSON.stringify([]))
    }
    else
      // if no local todos, just fetch user todos
      fetchTodos(token).then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  }

  // handles logout
  let logout = (e=null) => {
    // we only actually want to clear localStorage.todos if someone clicks a logout button
    if (e) {
      e.preventDefault()
      localStorage.setItem('todos', JSON.stringify([]))
      setTodos([])
    }
    // remove localStorage values, and set todos to empty array
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // update state variables
    setToken('')
    setUser('')
    setIsLoggedIn(false)
  }

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={isLoggedIn} user={user}/>
        <Routes>
          <Route path='/' element={<Todos todos={todos} setTodos={setTodos} user={user} isLoggedIn={isLoggedIn}/>}/>
          <Route path='/login' element={ <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} login={login} token={token} setToken={setToken}/> }/>
          <Route path='/profile' element={<Profile logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
