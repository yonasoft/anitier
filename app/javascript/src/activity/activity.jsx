// home.jsx
import React, { useState } from 'react';
import './activity.scss';
import NavBar from '../navbar/navbar'
import TierColumn from '../tierlist_column/tier_column';

export default function Activity() {

  const [activities, setRequireSignup] = useState([]);

  return (
    <div id="root">
      <NavBar />
      <div className="container">
        <div className="row">
          <div className="col-12 bg-light py-2 d-flex">
            <h1 className="me-auto">Activity</h1>
            <div className="btn-group ms-auto">
              <select defaultValue="1" className="form-select form-select-lg" aria-label=" example">
                <option value="1">Recent</option>
                <option value="2">Hot</option>
                <option value="3">Top</option>
              </select>
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
