// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './navbar.scss';

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand text-danger" href="/">AniTier</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="create">Create</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="templates">Templates</a>
            </li>
          </ul>
          <ul id="account-nav" className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link btn btn-block mb-0 text-light" href="/welcome">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}




