import React, { useState } from 'react';
import './login.scss';
import NavBar from '../navbar/navbar'

export default function SignUpWidget({ setRequireSignup }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div id="signup-widget" className="border rounded bg-light shadow-lg d-flex flex-column align-items-center">
            <h2 className="h2 mb-3 mt-2 fw-bold">Sign up</h2>
            <div className="form-floating mb-3">
                <input type="text" className="form-control form-control-lg" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating mb-3">
                <input type="email" className="form-control form-control-lg" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email">E-mail</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control form-control-lg" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password">Password</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control form-control-lg" id="confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <label htmlFor="confirm">Password Confirmation</label>
            </div>
            <button id="login-btn" className="btn btn-primary btn-block mb-0 text-light font-weight-bold mt-3 mb-3" >Create My Account</button>
            <p>Already have an account? <a className="link-primary mt-4" onClick={() => setRequireSignup(false)}>Login</a></p>
        </div >
    )
}
