import React, { useState } from 'react'

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
                    onSubmit={submitHandler}
                    onChange={changeHandler}
                    className="form-container"
                    autoComplete='off'
                >
                    <div className="form-item">
                        <label>username</label>
                        <input name="username" />
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
                        <p>Don't have an account? Please <span className='register-text' onClick={()=>setRegisterSelected(true)}>register</span></p>
                    </div>
                </form>
            </div>
        )
}
