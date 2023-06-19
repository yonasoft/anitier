import React from 'react';
import { Button } from 'react-bootstrap';
import { ContentType } from '../../../utils/constants';

export default function SearchResultImport({ result, contentType, inventory, addContentToInventory }) {
    const coverImage = result.media.coverImage?.large;

    return (
        <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
                {coverImage && <img src={coverImage} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />}
                <h4 className="mb-0">{contentType === ContentType.character ? `${result.media.name.first} ${result.media.name.last}` : result.media.title.english || result.media.title.romaji}</h4>
            </div>
            <Button
                className="ml-auto ma-2"
                disabled={inventory.some(item => item === result.media.id)}
                onClick={() => addContentToInventory(result.media.id)}
            >
                Add
            </Button>
        </div>
    );
}
