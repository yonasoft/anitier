import React, { useState } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'

//TODO: 2
//tier edit
//tier view
//tier templates
//tier user page


export default function CreateBuild({ nextStep, previousStep }) {

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <h1>Create(Build)</h1>
                    <div className="col-8 ">
                        <a className="btn btn-primary text-light my-2" href="#">Share</a>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="title" />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" id="description" rows="3" style={{ height: "100%" }}></textarea>
                            <label htmlFor="description">Description(optional)</label>
                        </div>
                        <div>
                            <h3 className="my-2">
                                Ranks
                            </h3>
                        </div>
                    </div>
                    <div className="col-4 "></div>
                </div>
            </div>
        </React.Fragment>
    );
}
