import React, { useState } from 'react'

export default function Login() {

    let [ form, setForm] = useState ({
        username: '',
        password: '',
        password2: '',
        email: ''
    })
    let [ registerSelected, setRegisterSelected ] = useState(false)
    let [ message, setMessage ] = useState('jenqui')


    if (!registerSelected)
        return (
            <div className="login-register-container">
                <form
                    onSubmit={()=>{}}
                    onChange={()=>{}}
                    className="form-container"
                    autoComplete='off'
                >
                    <div className="form-item">
                        <label>Username</label>
                        <input name="name" />
                    </div>
                    <div className="form-item">
                        <label>Password</label>
                        <input name="password" />
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
                    onSubmit={()=>{}}
                    onChange={()=>{}}
                    className="form-container"
                    autoComplete='off'
                >
                    <div className="form-item">
                        <label>username</label>
                        <input name="name" />
                    </div>
                    <div className="form-item">
                        <label>email</label>
                        <input name="email" />
                    </div>
                    <div className="form-item">
                        <label>Password</label>
                        <input name="password" />
                    </div>
                    <div className="form-item">
                        <label>Repeat Password</label>
                        <input name="password2" />
                    </div>
                    <button>register</button>
                    <div className="message">
                        <h4>{message}</h4>
                    </div>
                    <div className="login-register-text">
                        <p>Don't have an account? Please <span className='register-text' onClick={()=>setRegisterSelected(true)}>register</span></p>
                    </div>
                </form>
            </div>
        )
}
