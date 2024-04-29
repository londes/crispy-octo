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

  // only reason we are setting logged in to true here is because if false we get some bad flicker on our Profile/Login link, and we check for token right away in our [token] useEffect which happens much faster than waiting for a response from the server
  let [ isLoggedIn, setIsLoggedIn ] = useState(false)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')))
  let [ todos, setTodos ] = useState([])

  useEffect(()=>{
    const verify_token = async () => {
      try {
        if (!token)
          setIsLoggedIn(false)
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
  }

  // this used to be handleLogout in our Profile component until we moved it into the parent. should we just move it back? Could avoid making context entirely
  let logout = (e) => {
    e.preventDefault()
    // remove localStorage values
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // update state variables
    setToken('')
    setUser('')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    fetchTodos().then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  }, [])

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={isLoggedIn}/>
        <Routes>
          <Route path='/' element={<Todos todos={todos} setTodos={setTodos} />}/>
          <Route path='/login' element={ <Login setIsLoggedIn={setIsLoggedIn} login={login}/> }/>
          <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} login={login} logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
