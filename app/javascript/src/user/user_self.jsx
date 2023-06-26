import React, { useState, useEffect } from 'react';
import './user.scss';
import NavBar from '../components/navbar/navbar';

export default function UserSelf({ userOnPage }) {

    
    return (
        <React.Fragment>
            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <h2 className="username">Your Profile</h2>
                        <form>
                            <div className="form-group">
                                <label>{userOnPage.bio}</label>
                                <textarea className="form-control my-2" rows="7" placeholder="Enter biography" />
                            </div>
                        </form>
                    </div>
                    <div className="col-12 col-md-8 text-center">
                        <h3>Your Tier Lists</h3>
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
