import React from 'react';
import ReactDOM from 'react-dom';
import SearchPage from './search_page';


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <SearchPage />,
        document.body.appendChild(document.createElement('div')),
    )
})