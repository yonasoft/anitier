import React, { useState, useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import ContentItem from '../content_item/content_item';
import { fetchContentModel } from '../../utils/internal_apis/tierlist_apis';

import './tier.scss';
import ContentItemNonDraggable from '../content_item/content_item_nondraggable';



export default function TierNonDroppable({ tier, tierIndex, source, contentType }) {

    const [tierContent, setTierContent] = useState([])

    useEffect(() => {
        const fetchContent = async () => {
            if (tier && tier.content_ids) {
                const fetchedContent = await Promise.all(tier.content_ids.map(fetchContentModel));
                setTierContent(fetchedContent);
            } else {
                console.log('tier is undefined');
            }
        };
        fetchContent();
    }, [tier]);

    return (
        <div className="tier d-flex w-100" style={{ minHeight: "135px", maxHeight: "270px" }}>
            <div className="rank text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#3F5C9E", width: "75px" }}>
                {tier.rank}
            </div>

            <div
                className='content bg-white p-2 w-100'
            >
                {tier && tierContent && tierContent.map((item, index) => (
                    <ContentItemNonDraggable key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );

};



