import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ setIsLoggedIn, logout }) {

    return (
    <div className='logout-container'>
        <button onClick={logout}>logout</button>
    </div>
)
}
