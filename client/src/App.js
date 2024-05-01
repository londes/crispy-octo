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

function App() {

  let [ isLoggedIn, setIsLoggedIn ] = useState(false)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')))
  let [ todos, setTodos ] =  useState([])//useState(JSON.parse(localStorage.getItem('todos')))

  useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token)
          // we could go async here and leverage then, or just update our logout function and call it here.
          // we could also just set our empty array here
          // we might be bloating our login function
          //setIsLoggedIn(false)
          logout()
        else {
          let res = await verifyToken(token)
          return res.ok ? login(token) : logout()
        }
      } catch (error) {
        console.log(error)
      }
    }
    verify_token() //.then(res => console.log(res))
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
    // update any todos from localStorage
    // ...
    // grab our todos from the server, because our user is logged in
    fetchTodos().then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  }

  // this used to be handleLogout in our Profile component until we moved it into the parent. should we just move it back? Could avoid making context entirely
  let logout = (e=null) => {
    e?.preventDefault()
    // remove localStorage values, and set todos to empty array
    console.log('in our logout')
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
        <Navbar loggedIn={isLoggedIn}/>
        <Routes>
          <Route path='/' element={<Todos todos={todos} setTodos={setTodos} user={user} isLoggedIn={isLoggedIn}/>}/>
          <Route path='/login' element={ <Login setIsLoggedIn={setIsLoggedIn} login={login}/> }/>
          <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} login={login} logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
