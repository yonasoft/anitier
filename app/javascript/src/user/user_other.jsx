import React, { useState, useEffect } from 'react';
import './user.scss';
import NavBar from '../components/navbar/navbar';

export default function UserOther({ userOnPage }) {

    return (
        <React.Fragment>
            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <h2 className="username">{userOnPage.username}'s Profile</h2>
                        <p className='bio bg-light my-2'>{userOnPage.bio}</p>
                    </div>
                    <div className="col-12 col-md-8 text-center">
                        <h3>{userOnPage.username}'s Tier List</h3>
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}
