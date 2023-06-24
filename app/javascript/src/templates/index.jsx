import React from 'react';
import ReactDOM from 'react-dom';
import Templates from './templates'

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Templates />,
        document.body.appendChild(document.createElement('div')),
    )
})