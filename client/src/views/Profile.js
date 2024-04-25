import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ setIsLoggedIn }) {

    let navigate = useNavigate()

    let handleLogout = (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setTimeout(()=>{
            navigate('/')
        }, 1000)
    }

    return (
    <div className='logout-container'>
        <button onClick={handleLogout}>logout</button>
    </div>
)
}
