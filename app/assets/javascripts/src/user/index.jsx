import React from 'react';
import ReactDOM from 'react-dom';
import User from './user';


document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('params');
    const data = JSON.parse(node.getAttribute('data-params'));
    console.log('data', data);
    console.log('data user id', data.user_id);

    ReactDOM.render(
        <User userId={data.user_id} />,
        document.body.appendChild(document.createElement('div'))
    );
});
