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
          <div className="col-2"></div>
          <div className="col-8 bg-light py-2 d-flex justify-content-between">
            <h1>Activity</h1>
            <div class="btn-group">
              <select class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                <option selected value="1">Recent</option>
                <option value="2">Hot</option>
                <option value="3">Top</option>
              </select>
            </div>
            <div id="activities" className="row">

            </div>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    </div>
  )
}
