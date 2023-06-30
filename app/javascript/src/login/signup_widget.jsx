import React, { useState } from 'react';
import './login.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { fetchUserDataById, login, signup } from '../utils/internal_apis/auth_api';

export default function SignUpWidget({ setRequireSignup }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);


    async function handleSignup(e) {
        e.preventDefault();

        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            setError("All fields must be filled");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (username.length < 3 || username.length > 25) {
            setError("Username must be between 3 and 25 characters long");
            return;
        }

        if (!/^[\w+\-.]+@[a-z\d\-.]+\.[a-z]+$/i.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            const signupData = await signup(username, email, password);
            await login(username, password);
            console.log('signup', signupData);
            handleShow();
            setTimeout(() => {
                handleClose();
                window.location.href = `/user/${signupData.user_id}`;
            }, 3000);
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        }
    };


    return (
        <div id="signup-widget" className="border rounded bg-light shadow-lg d-flex flex-column align-items-center">
            <h2 className="h2 mb-3 mt-2 fw-bold">Sign up</h2>
            {error && <div className="alert alert-danger">{error}</div>}
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
            <button id="login-btn" className="btn btn-primary btn-block mb-0 text-light font-weight-bold mt-3 mb-3" onClick={handleSignup} >Create My Account</button>
            <p>Already have an account? <a className="link-primary mt-4" onClick={() => setRequireSignup(false)}>Login</a></p>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Account Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your account has been created with the username {username} and email {email}.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}
