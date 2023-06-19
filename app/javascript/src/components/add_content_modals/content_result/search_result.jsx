import React from 'react';
import { Button } from 'react-bootstrap';
import { ContentType } from '../../../utils/constants';

export default function SearchResult({ result, contentType, inventory, addContentToInventory }) {
    return (
        <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
                <img src={result.coverImage?.large || result.image?.large} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />
                <h4 className="mb-0">{contentType === ContentType.character ? `${result.name.first} ${result.name.last}` : result.title.english || result.title.romaji}</h4>
            </div>
            <Button className="ml-auto ma-2" disabled={inventory.some(item => item === result.id)} onClick={() => addContentToInventory(result.id)}>Add</Button>
        </div>
    );
}
