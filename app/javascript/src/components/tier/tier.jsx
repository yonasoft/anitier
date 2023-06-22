import React, { useState, useEffect } from 'react';
import { fetchAniListContent } from '../../utils/external_apis/anilist_api';
import { fetchMALContentById } from '../../utils/external_apis/mal_api';
import { ContentType } from '../../utils/constants';
import './tier.scss';
import ContentItem from '../content_item/content_item';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ContentFetcher = async (source, contentType, id) => {
    let content = null;
    if (source === 'anilist') {
        content = await fetchAniListContent(contentType, id);
        if (content) {
            const title = contentType === ContentType.character ? `${content.name.first} ${content.name.last}` : content.title.english || content.title.romaji;
            const image = content.coverImage?.large || content.image?.large;
            console.log('a tier content', content);
            return { id: content.id, title, image };
        }
    } else if (source === 'mal') {
        content = await fetchMALContentById(contentType, id);
        if (content) {
            const title = content.title || content.name;
            const image = contentType === ContentType.character ? content.images.jpg.image_url : content.main_picture.large;
            return { id: content.id || content.mal_id, title, image };
        }
    }
    return null;
};

export default function Tier({ tier, tierIndex, source, contentType }) {

    return (
        <div className="tier d-flex w-100" style={{ minHeight: "135px", maxHeight: "270px" }}>
            <div className="rank text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#3F5C9E", width: "75px" }}>
                {tier.rank}
            </div>
            <Droppable droppableId={tierIndex.toString()} direction="horizontal">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='content bg-white p-2 w-100'
                    >
                        {tier && tier.contents && tier.contents.map((item, index) => (
                            <ContentItem key={item.id} item={item} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );

};

