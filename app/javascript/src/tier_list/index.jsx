import React from 'react';
import ReactDOM from 'react-dom';
import TierList from './TierList';

document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('tier-list-root');
    const data = JSON.parse(node.getAttribute('data-tier-list-id'));

    ReactDOM.render(
        <TierList tierListId={data} />,
        node
    );
});
