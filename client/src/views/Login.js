import React, { useState } from 'react'
import { fetchUsers, addUser, loginUser } from '../services/userRequests'

export default function Login() {

    let [ formValues, setFormValues] = useState ({
        username: '',
        password: '',
        password2: '',
        email: '',
        username_email: ''
    })
    let [ registerSelected, setRegisterSelected ] = useState(false)
    let [ message, setMessage ] = useState('')

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
                    res.message ? setMessage(res.message) : setMessage('server error, did not register user. please try again')
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
                    console.log(res)
                })
            }
        }
        // throw error
        else {}
        // fetchUsers().then(()=>{console.log('fetched')})
    }

    if (!registerSelected)
        return (
            <div className="login-register-container">
                <form
                    onSubmit={submitHandler}
                    onChange={changeHandler}
                    className="form-container"
                    autoComplete="off"
                >
                    <div className="form-item">
                        <label>username or email</label>
                        <input name="username_email" />
                    </div>
                    <div className="form-item">
                        <label>password</label>
                        <input name="password"/>
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
                    onChange={changeHandler}
                    className="form-container"
                    autoComplete='off'
                >
                    <div className="form-item">
                        <label>username</label>
                        <input name="username"/>
                    </div>
                    <div className="form-item">
                        <label>email</label>
                        <input name="email" />
                    </div>
                    <div className="form-item">
                        <label>password</label>
                        <input name="password" />
                    </div>
                    <div className="form-item">
                        <label>verify password</label>
                        <input name="password2" />
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
