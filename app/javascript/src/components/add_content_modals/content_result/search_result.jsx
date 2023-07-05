import React from 'react';
import { Button } from 'react-bootstrap';
import { ContentType } from '../../../utils/constants';

export default function SearchResult({ result, isApiAlreadyAdded, addContentToInventory }) {
    const id = result?.mal_id || result?.id;
    const image = (result.coverImage?.large || result.main_picture?.large || result.main_picture?.medium || result.images?.jpg?.image_url || result.image.large);
    const name = result.title?.english || result.title?.romaji || result?.title || (result.name?.first + ' ' + result.name?.last) || result?.name || "Unknown";

    return (
        <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
                {image && <img src={image} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />}
                <h4 className="mb-0">{name}</h4>
            </div>
            <Button className="ml-auto ma-2" disabled={isApiAlreadyAdded(id)} onClick={() => addContentToInventory(id, name, image)}>Add</Button>
        </div>
    );
}
