// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './tier_column.scss';

export default function TierColumn({tierList, setTierList, listInfo, setListInfo}) {
  return (
    <div id="tier-column" className='container'>
      <div className='col-md-6'>
        <div id="tiers">
        </div>
        <div id="list-info">
        </div>
      </div>
    </div>
  )
}




