import React from 'react';
import ReactDOM from 'react-dom';
import TierList from './tier_list';


document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('params');
    const data = JSON.parse(node.getAttribute('data-params'));
    console.log('data', data);
    console.log('data tierlist', data.tier_list_id);
    
    ReactDOM.render(
        <TierList tierListId={data.tier_list_id} />,
        document.body.appendChild(document.createElement('div'))
    );
});
