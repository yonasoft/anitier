// home.jsx
import React, { useState } from 'react';
import './tier_list.scss';
import NavBar from '../navbar/navbar'



export default function UserTierList() {


    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <h1>Title</h1>
                    <a className="btn btn-primary text-light my-2" href="#">Share</a>
                    <div className="col-8 ">
                        <div id="tiers">
                        </div>
                    </div>
                    <div className="col-4 ">
                        <p id="description">
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
