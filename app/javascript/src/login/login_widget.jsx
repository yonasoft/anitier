// home.jsx
import React, { useState } from 'react';
import './login.scss';
import NavBar from '../navbar/navbar'

export default function LoginWidget({ setRequireSignup }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value, () => {
            console.log(username);
        });
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value, () => {
            console.log(password);
        });
    };


    return (
        <div id="login-widget" className="border rounded bg-light shadow-lg d-flex flex-column align-items-center">
            <h2 className="h2 mb-3 mt-2 fw-bold">Login</h2>
            <div className="form-floating mb-3">
                <input type="text" className="form-control form-control-lg" id="username" value={username} onChange={handleUsernameChange} />
                <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control form-control-lg" id="password" value={password} onChange={handlePasswordChange} />
                <label htmlFor="password">Password</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                <label className="form-check-label text-start" htmlFor="flexCheckDefault">Remember me</label>
            </div>
            <button id="login-btn" className="btn btn-primary btn-block mb-0 text-light font-weight-bold mt-3 mb-3" >Login</button>
            <p>Don't have an account yet? <a className="link-primary mt-4" onClick={() => setRequireSignup(true)}>Sign Up</a></p>
        </div >
    )
}