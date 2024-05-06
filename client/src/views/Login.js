import React, { useState, useEffect } from 'react'
import { fetchUsers, addUser, loginUser } from '../services/userRequests'
import { useNavigate } from 'react-router-dom'

export default function Login({ login, setIsLoggedIn, setToken }) {
    
    let [ formValues, setFormValues] = useState ({
        username: '',
        password: '',
        password2: '',
        email: '',
        username_email: ''
    })
    let [ registerSelected, setRegisterSelected ] = useState(false)
    let [ message, setMessage ] = useState('')

    let navigate = useNavigate()

    useEffect(()=>{
        setFormValues({
            username: '',
            password: '',
            password2: '',
            email: '',
            username_email: ''
        })
        setMessage('')
    }, [registerSelected])

    let changeHandler = e => setFormValues({...formValues, [e.target.attributes.name.value]: e.target.value})

    let submitHandler = e => {
        e.preventDefault()
        // handle register
        let { username, email, password, password2, username_email } = formValues
        if (registerSelected) {
            if ( !username || !email || !password || !password2 )
                setMessage('all fields are required')
            else if (password !== password2)
                setMessage('passwords must match')
            else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username))
                setMessage('username must contain only letters and numbers')
            else if (!/^\S+@\S+\.\S+$/.test(email))
                setMessage('please enter a valid email')
            else {
                // success, send to back-end
                addUser(formValues).then((res)=>{
                    if (res.ok) {
                        setMessage(res.message)
                        login(res.token)
                        setTimeout(()=>{
                            navigate('/')
                        }, 1000)
                    }
                    else {
                        setMessage(res.message)
                    }
                })
            }
        }
        // handle login
        else if (!registerSelected) {
            // validation on front-end
            if ( !username_email || !password)
                setMessage('all fields are required')
            // if it's both not a valid email nor a valid username
            else if (!/^\S+@\S+\.\S+$/.test(username_email) && !/^[A-Za-z][A-Za-z0-9]*$/.test(username_email))
                setMessage('a valid username or email is required')
            else {
                loginUser(formValues).then((res) => {
                    if (res.ok) {
                        setMessage(res.message)
                        login(res.token)
                        setTimeout(()=>{
                            navigate('/')
                        }, 1000)
                    }
                    else {
                        setMessage(res.message)
                    }
                })
            }
        }
        // throw error
        else { console.log('ERROR: something broke in our submitHandler, there is no value for registerSelected')}
    }

    if (!registerSelected)
        return (
            <div className="login-register-container">
                <form
                    onSubmit={submitHandler}
                    className="form-container"
                    autoComplete="off"
                >
                    <div className="form-item">
                        <label>username or email</label>
                        <input name="username_email" value={formValues.username_email} onChange={changeHandler}/>
                    </div>
                    <div className="form-item">
                        <label>password</label>
                        <input name="password" value={formValues.password} onChange={changeHandler}/>
                    </div>
                    <button>login</button>
                    <div className="message">
                        <h4>{message}</h4>
                    </div>
                    <div className="login-register-text">
                        <p>Don't have an account? Please <span className='register-text' onClick={()=>setRegisterSelected(true)}>register</span></p>
                    </div>
                </form>
            </div>
        )
    else if (registerSelected)
        return (
            <div className="login-register-container">
                <form
                    onSubmit={submitHandler}
                    className="form-container"
                    autoComplete='off'
                >
                    <div className="form-item">
                        <label>username</label>
                        <input name="username" value={formValues.username} onChange={changeHandler}/>
                    </div>
                    <div className="form-item">
                        <label>email</label>
                        <input name="email" value={formValues.email} onChange={changeHandler}/>
                    </div>
                    <div className="form-item">
                        <label>password</label>
                        <input name="password" value={formValues.password} onChange={changeHandler}/>
                    </div>
                    <div className="form-item">
                        <label>verify password</label>
                        <input name="password2" value={formValues.password2} onChange={changeHandler}/>
                    </div>
                    <button>register</button>
                    <div className="message">
                        <h4>{message}</h4>
                    </div>
                    <div className="login-register-text">
                        <p>Return to <span className='register-text' onClick={()=>setRegisterSelected(false)}>login</span></p>
                    </div>
                </form>
            </div>
        )
}
