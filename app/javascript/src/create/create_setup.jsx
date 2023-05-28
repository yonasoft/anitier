import React, { useState } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'


//TODO: 1

export default function CreateSetup({ nextStep }) {
    return (
        <div id="create-build">
            <div className="container">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8 bg-light py-2">
                        <h1>Create(Setup)</h1>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control form-control-lg" id="title" />
                            <label htmlFor="title">Title</label>
                        </div>
                    </div>
                    <div className="col-2"></div>
                    <button onClick={nextStep}>Next</button>
                </div>
            </div>
        </div>

    );
}
