import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar.js';
import Login from './views/Login.js';
import Profile from './views/Profile.js';
import Todos from './views/Todos.js'

import { fetchTodos } from './services/todosRequests.js'
import { fetchUsers, verifyToken } from './services/userRequests.js';

function App() {

  // only reason we are setting logged in to true here is because if false we get some bad flicker on our Profile/Login link, and we check for token right away in our [token] useEffect which happens much faster than waiting for a response from the server
  let [ isLoggedIn, setIsLoggedIn ] = useState(true)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(localStorage.getItem('userId'))
  let [ todos, setTodos ] = useState([])

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

  useEffect(() => {
    fetchTodos().then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
  }, [])

  return (
    <div className="App">
      <Router>
        <Navbar loggedIn={isLoggedIn}/>
        <Routes>
          <Route path='/' element={<Todos todos={todos} setTodos={setTodos} />}/>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path='/profile' element={<Profile setIsLoggedIn={setIsLoggedIn} logout={logout}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
