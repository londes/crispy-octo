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
  let [ todos, setTodos ] =  useState([])//useState(JSON.parse(localStorage.getItem('todos')))

  useEffect(() => {
    console.log('in our use effect and isLoggedIn is now: ', isLoggedIn)
    const verify_token = async () => {
      try {
        if (!token)
          logout()
        else {
          let res = await verifyToken(token)
          console.log(token)
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
      localStorage.removeItem('todos')
    }
    else
      // if no local todos, just fetch user todos
      fetchTodos(token).then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  }

  // this used to be handleLogout in our Profile component until we moved it into the parent. should we just move it back? Could avoid making context entirely
  let logout = (e=null) => {
    console.log('in our logout')
    e?.preventDefault()
    // remove localStorage values, and set todos to empty array
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.setItem('todos', JSON.stringify([]))
    // update state variables
    setToken('')
    setUser('')
    setTodos([])
    setIsLoggedIn(false)
    // grab our todos from localStorage, because user is not logged in
  }

  // useEffect(() => {
  //   fetchTodos().then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  // }, [])

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={isLoggedIn} user={user}/>
        <Routes>
          <Route path='/' element={<Todos todos={todos} setTodos={setTodos} user={user} isLoggedIn={isLoggedIn}/>}/>
          <Route path='/login' element={ <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} login={login} token={token} setToken={setToken}/> }/>
          <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} login={login} logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
