import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './navbar.scss';
import { fetchUserState, apiLogout } from '../../utils/internal_apis/auth_api';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

export default function NavBar() {
  const [userId, setUserId] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchUserState().then(userState => {
      if (isMounted) {
        setLoggedIn(userState.logged_in);
        if (userState.logged_in) {
          setUsername(userState.username);
          setUserId(userState.user_id);
        }
      }
    }).catch(error => console.error(error));

    return () => {
      isMounted = false; 
    }

  }, []);

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      await apiLogout();
      setLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Navbar expand="md" className="navbar-dark shadow p-2" style={{ backgroundColor: '#3F5C9E' }}>
      <div className="container">
        <Navbar.Brand href="/" className="text-light font-weight-bold"><span id="brand-ani">Ani</span><span id="brand-tier">Tier</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <Nav className="me-3">
            <Nav.Link href="/home" className="font-weight-bold text-light">Home</Nav.Link>
            <Nav.Link href="/search" className="font-weight-bold text-light">Search</Nav.Link>
            <Nav.Link href="/create" className="font-weight-bold text-light">Create</Nav.Link>   
          </Nav>
          {loggedIn ? (
            <Nav>
              <NavDropdown title={username} id="collasible-nav-dropdown" className="font-weight-bold text-light">
                <NavDropdown.Item href={`/user/${userId}`}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link id="login-btn" href="/login" className="btn btn-primary btn-block mb-0 text-light font-weight-bold">Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}
