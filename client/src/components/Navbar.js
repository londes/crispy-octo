import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ isLoggedIn }) {
  return (
    <div className='header-nav-right'>
          <div className='crispytodo-title'><h1>crispy todos</h1></div>
          <ul className='header-nav-links'>
            <li><Link to='/'>todos</Link></li>
            {isLoggedIn ? <li><Link to='/profile'>profile</Link></li> : <li><Link to='/login'>login</Link></li>}
          </ul>
        </div>
  )
}
