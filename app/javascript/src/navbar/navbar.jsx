// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './navbar.scss';

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand shadow p-3">
      <div className="container">
        <a className="navbar-brand text-light font-weight-bold" href="/"><span id="brand-ani">Ani</span><span id="brand-tier">Tier</span></a>
        <div className="collapse navbar-collapse d-flex justify-content-end " id="navbarSupportedContent">
          <ul className="navbar-nav d-flex justify-content-end me-3">
            <li className="nav-item">
              <a className="nav-link font-weight-bold text-light" href="/home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold text-light" href="/create">Create</a>
            </li>
            <li className="nav-item">
              <a className="nav-link font-weight-bold text-light " href="/templates">Templates</a>
            </li>
          </ul>
          <ul id="account-nav" className="navbar-nav ml-auto">
            <li className="nav-item">
              <a id="login-btn" className="nav-link btn btn-primary btn-block mb-0 text-light font-weight-bold" href="/login">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}




