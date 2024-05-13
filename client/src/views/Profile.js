import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ user, logout, isLoggedIn }) {

    let navigate = useNavigate()

    let profileLogout = e => {
        logout(e)
        setTimeout(()=>{
            navigate('/')
        }, 1000)
    }

    return (
    isLoggedIn 
    ? <div className='login-register-profile-wrapper'>
        <div className='login-register-container'>
            <div className='logout-container'>
                <div className='profile-picture'></div>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <button onClick={profileLogout}>logout</button>
            </div>
        </div>
    </div>
    : <></>
)
}