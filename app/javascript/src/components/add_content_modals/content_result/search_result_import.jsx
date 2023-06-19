import React from 'react';
import { Button } from 'react-bootstrap';
import { ContentType } from '../../../utils/constants';

export default function SearchResultImport({ result, contentType, inventory, addContentToInventory }) {
    const id = result.mal_id || result.id;
    const image = (result.main_picture?.large || result.coverImage?.large || result.main_picture?.medium || result.image.large || result.image || result.images.jpg.image_url);
    const name = result.title?.english || result.title?.romaji || result?.title || (result.name?.first ? `${result.name.first} ${result.name.last}` : result.name);
    console.log('result', result);
    console.log('coverimage', result.coverImage);
    return (
        <div className="result-result d-flex justify-content-between align-results-center py-2 px-3">
            <div className="d-flex align-items-center">
                {image && <img src={image} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />}
                <h4 className="mb-0">{name}</h4>
            </div>
            <Button
                className="ml-auto ma-2"
                disabled={inventory.some(item => item === id)}
                onClick={() => addContentToInventory(result.id || result.mal_id)}
            >
                Add
            </Button>
        </div>
    );
}
