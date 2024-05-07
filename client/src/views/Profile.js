import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ user, logout }) {

    let navigate = useNavigate()

    let profileLogout = e => {
        logout(e)
        setTimeout(()=>{
            navigate('/')
        }, 1000)
    }

    return (
    <div className='logout-container'>
        <div>{user.username}</div>
        <div>{user.email}</div>
        <button onClick={profileLogout}>logout</button>
    </div>
)
}