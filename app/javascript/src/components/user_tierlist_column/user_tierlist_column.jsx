import React, { useState, useEffect } from 'react';
import './user_tierlist_column.scss';
import { fetchContentModel, fetchTiersFromTierList } from '../../utils/internal_apis/tierlist_apis';


export default function UserTierListColumn({ id, tierList, isOwner, onDelete }) {

    const [tiers, setTiers] = useState([]);
    const [contentImages, setContentImages] = useState([]);

    const fetchTiers = async () => {
        try {
            const data = await fetchTiersFromTierList(id);
            console.log('tiers data in conte', data);
            setTiers(data);
            return data; // return the tiers data
        } catch (error) {
            console.error(error);
        }
    }

    const fetchImages = async (tiers) => { // accept tiers as argument
        let contentIds = tiers.flatMap(tier => tier.content_ids); // flatten content IDs
        try {
            let images = await Promise.all(contentIds.map(async id => {
                const content = await fetchContentModel(id);
                return content.image_url;
            }));
            console.log('images', images);
            setContentImages(images);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchTiers().then((data) => {
            fetchImages(data);
        });
    }, [
        id, tierList
    ]);

    const handleCardClick = () => {
        window.location.href = `/tierlist/${id}`;
    }

    return (
        <div className='column card col-12 my-1' onClick={handleCardClick}>
            <div className="card-body align-top">
                <div className='top' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p className='title card-title' style={{ margin: 0 }}><b>{tierList.title}</b></p>
                    {isOwner ? <button className='btn btn-danger' onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button> : null}
                </div>

                <div className='row'>
                    {contentImages.map((image, index) => {
                        return (
                            <div className='col-2 p-0 img-container' key={index}>
                                <img className='image' src={image} alt="content image" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}