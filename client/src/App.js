import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import Navbar from './components/Navbar.js';
import Login from './views/Login.js';
import Profile from './views/Profile.js';
import Todos from './views/Todos.js'
import Footer from './components/Footer.js';

import { fetchTodos } from './services/todosRequests.js'
import { verifyToken, fetchUser } from './services/userRequests.js';
import { addTodo } from './services/todosRequests.js';

function App() {

  let [ isLoggedIn, setIsLoggedIn ] = useState(false)
  let [ token, setToken ] = useState(localStorage.getItem('token'))
  let [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')))
  let [ todos, setTodos ] =  useState(JSON.parse(localStorage.getItem('todos')))

  useEffect(() => {
    // if a user is not logged in, we want to update/manage todos locally
    if (!isLoggedIn)
      localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // handle any updates or changes to our user in local storage as well
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  // our main function for handling login/logout state
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
    // grab our user from our server, set locally
    fetchUser(decoded.userId).then(res => {
      if (res.ok) {
        let { _id, username, email } = res.foundUser 
        let user = {
          userId: _id,
          username, email
        }
        setUser(user)
      }
    })
    // set token and user values to local storage
    localStorage.setItem('token', token)
    // update user login, user, and token state values
    setIsLoggedIn(true)
    setToken(token)
    // if we have todos on localStorage on register/login, add them to db for that user
    let localTodos = JSON.parse(localStorage.getItem('todos'))
    if (localTodos && localTodos?.length > 0) {
      // we want to add user_id, but remove index (avoids bugs if user has existing todos on login, and index isn't required)
      let newTodos = localTodos.map(todo => {
        let localTodo = { ...todo, user_id: decoded.userId}
        delete localTodo.index
        return localTodo
      })
      // add our local todos, then fetch and set
      addTodo(newTodos).then(() => fetchTodos(token)).then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
    }
    else
      // if no local todos, just fetch user todos
      fetchTodos(token).then(todos => setTodos(todos.sort((a,b) => a.index - b.index)))
    // remove local todos to avoid adding unwanted lingering todos for a logged in user. if there are no local todos, set to empty array to handle the null case
    localStorage.setItem('todos', JSON.stringify([]))
  }

  // handles logout
  let logout = (e=null) => {
    // this is to handle initial load of website for a new user. if todos is null, set to an empty array
    if (!todos)
      setTodos([])
    // we only actually want to clear todos if someone clicks a logout button
    if (e) {
      e.preventDefault()
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
          <Route path='/profile' element={<Profile user={user} logout={logout}/>}/>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
