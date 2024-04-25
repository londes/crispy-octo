import React from 'react'

export default function Profile({ setIsLoggedIn }) {

    let handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        setIsLoggedIn(false)
    }

    return (
    <div className='logout-container'>
        <button onClick={handleLogout}>logout</button>
    </div>
)
}
