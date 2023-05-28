// home.jsx
import React, { useState } from 'react';
import './login.scss';
import NavBar from '../navbar/navbar'
import LoginWidget from './login_widget';
import SignUpWidget from './signup_widget';

export default function Login() {

  const [requireSignup, setRequireSignup] = useState(false);

  return (
    <div id="root">
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div id="welcome-area" className="col-0 col-lg-6">
          </div>
          <div id="login-area" className="col-12 col-lg-6 bg-white d-flex align-items-center justify-content-center">
            {requireSignup ? <SignUpWidget setRequireSignup={setRequireSignup} /> : <LoginWidget setRequireSignup={setRequireSignup} />}
          </div>
        </div>
      </div>
    </div>
  )
}
