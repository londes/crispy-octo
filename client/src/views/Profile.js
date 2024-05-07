import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ logout }) {

    let navigate = useNavigate()

    let profileLogout = e => {
        logout(e)
        setTimeout(()=>{
            navigate('/')
        }, 1000)
    }

    return (
    <div className='logout-container'>
        <button onClick={profileLogout}>logout</button>
    </div>
)
}