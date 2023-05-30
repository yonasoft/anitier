import React, { useState } from 'react';
import './templates.scss';
import NavBar from '../navbar/navbar'
import TierColumn from '../tierlist_column/tier_column';

export default function Templates() {

  return (
    <div id="root">
      <NavBar />
      <div className="container">
        <div className="row">
          <div className="col-12 bg-light py-2">
            <div className="d-flex">
              <h1 className="me-auto">Templates</h1>
              <div className="btn-group ms-auto">
                <select defaultValue="1" className="form-select form-select-lg" aria-label=" example">
                  <option value="1">Anime</option>
                  <option value="2">Manga</option>
                  <option value="3">Characters</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary" type="button">Add</button>
            <div class="input-group pt-3 pb-3 bg-light">
              <input type="text" class="form-control" placeholder="Search..." aria-label="Search" aria-describedby="basic-addon2" />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button">Search</button>
              </div>
            </div>
          </div>
          <div className="col-12 bg-light">
            <div id="activities" className="row">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

