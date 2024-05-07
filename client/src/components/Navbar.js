import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ loggedIn, user }) {
  return (
    <div className='header-nav'>
          <div className='crispytodo-title'><h1>crispy 🍗</h1></div>
          <ul className='header-nav-links'>
            <li><Link to='/'>todos</Link></li>
            {loggedIn ? <li><Link to='/profile'>{user.username}</Link></li> : <li><Link to='/login'>login</Link></li>}
          </ul>
        </div>
  )
}
