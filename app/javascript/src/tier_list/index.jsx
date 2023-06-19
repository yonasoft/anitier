import React from 'react';
import ReactDOM from 'react-dom';
import TierList from './tier_list';


document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('tier-list-root');
    const data = JSON.parse(node.getAttribute('data-tier-list-id'));

    ReactDOM.render(
        <TierList tierListId={data} />,
        node
    );
});
