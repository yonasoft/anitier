import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import './search_result.scss';




const getContentProperties = (result, isApiAlreadyAdded) => {
    const id = result?.mal_id || result?.id;
    const image = result?.coverImage?.large || result?.main_picture?.large || result?.main_picture?.medium || result?.images?.jpg?.image_url || result?.image?.large;
    const name = result?.title?.english || result?.title?.romaji || result?.title || (result?.name?.first + ' ' + result?.name?.last) || result?.name || "Unknown";
    const isAdded = isApiAlreadyAdded(id);

    return { id, image, name, isAdded };
}

const ResultCard = ({ result, isApiAlreadyAdded, addContentToInventory }) => {
    const { id, image, name, isAdded } = getContentProperties(result, isApiAlreadyAdded);

    return (
        <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
            <div className="d-flex align-items-center">
                <img className="content-image" src={image} alt={`${name}'s cover image`} />
                <h4 className="mb-0">{name}</h4>
            </div>
            <Button
                className="ml-auto ma-2"
                disabled={isAdded}
                onClick={() => !isAdded && addContentToInventory(id, name, image)}
            >
                {isAdded ? 'Added' : 'Add'}
            </Button>
        </div>
    );
}

ResultCard.propTypes = {
    result: PropTypes.object.isRequired,
    isApiAlreadyAdded: PropTypes.func.isRequired,
    addContentToInventory: PropTypes.func.isRequired,
};

export const SearchResult = ResultCard;
export const SearchResultImport = ResultCard;
