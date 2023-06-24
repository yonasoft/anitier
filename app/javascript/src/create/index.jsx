// index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Create from './create';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Create />,
        document.body.appendChild(document.createElement('div')),
    )
})