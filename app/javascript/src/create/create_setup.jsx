import React, { Fragment, useState } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'


//TODO: 1

export default function CreateSetup({ nextStep }) {

    const [currentList, setCurrentList] = useState({})

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <h1>Create(Setup)</h1>
                    <div className="col-8 ">
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="title" />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" id="description" rows="10" style={{ height: "100%" }}></textarea>
                            <label htmlFor="description">Description(optional)</label>
                        </div>
                    </div>
                    <div className="col-4 ">
                        <div className="d-inline-flex justify-content-evenly w-100">
                            <a className="btn btn-secondary btn-block text-light mb-auto" href="/">Cancel</a>
                            <button className="btn btn-primary btn-block text-light mb-auto" onClick={nextStep}>Next</button>
                        </div>
                        <div >
                            <label htmlFor="source" className="mt-3"><h4>Source</h4></label>
                            <select className="form-select" defaultValue="1" aria-label="Default select example">
                                <option value="1">AniList</option>
                                <option value="2">MyAnimeList</option>
                            </select>
                            <label htmlFor="source" className="mt-3"><h4>Type</h4></label>
                            <select className="form-select" defaultValue="1" aria-label="Default select example">
                                <option value="1">Animes</option>
                                <option value="2">Mangas</option>
                                <option value="3">Characters</option>
                            </select>
                        </div>
                        <div className="mt-3">
                            <h4>Tiers</h4>
                            <div id="tiers">
                            </div >
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="New Tier" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
