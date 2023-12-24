import React, { useState } from 'react';// Import useHistory from react-router-dom
import './login.scss';
import { login } from '../utils/internal_apis/auth_api';


export default function LoginWidget({ setRequireSignup }) {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            await login(username, password);
            window.location.href = '/home'; // Redirect to home page
        } catch (error) {
            setError(error.message); // Show error message
            console.error('Error:', error);
        }
    };

    return (
        <div id="login-widget" className="border rounded bg-light shadow-lg d-flex flex-column align-items-center">
            <h2 className="h2 mb-3 mt-2 fw-bold">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-floating mb-3">
                <input type="text" className="form-control form-control-lg" id="username" value={username} onChange={handleUsernameChange} />
                <label htmlFor="username">Username or E-mail</label>
            </div>
            <div className="form-floating mb-3">
                <input type="password" className="form-control form-control-lg" id="password" value={password} onChange={handlePasswordChange} />
                <label htmlFor="password">Password</label>
            </div>
            <button id="login-btn" className="btn btn-primary btn-block mb-0 text-light font-weight-bold mt-3 mb-3" onClick={handleLogin}>Login</button>

            <p>Don't have an account yet? <a className="link-primary mt-4" onClick={() => setRequireSignup(true)}>Sign Up</a></p>
        </div >
    )
}
