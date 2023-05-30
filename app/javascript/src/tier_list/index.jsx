// index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import TierList from './tier_list';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <TierList />,
        document.body.appendChild(document.createElement('div')),
    )
})