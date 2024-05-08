import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ loggedIn, user }) {
  return (
    <>
    <div className='header-background'></div>
      <div className='header-nav'>
        <div className='crispytodo-title'><h1>Crispy todos</h1></div>
          <ul className='header-nav-links'>
            <li className='header-nav-text'><Link to='/'>todos</Link></li>
            {loggedIn ? <li className='header-nav-text'><Link to='/profile'>{user.username}</Link></li> : <li className='header-nav-text'><Link to='/login'>login</Link></li>}
        </ul>
      </div>
    </>
  )
}
