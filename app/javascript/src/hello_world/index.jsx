// index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './hello_world';

document.addEventListener('DOMContentLoaded', () => {

    ReactDOM.render(
        <HelloWorld />,
        document.body.appendChild(document.createElement('div')),
    )
})