// index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Activity from './activity';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Activity />,
        document.body.appendChild(document.createElement('div')),
    )
})