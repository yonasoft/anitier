import React, { useState, useEffect } from 'react';
import { fetchAniListContent } from '../../utils/external_apis/anilist_api';
import { fetchMALContentById } from '../../utils/external_apis/mal_api';
import { ContentType } from '../../utils/constants'
import './inventory.scss';
import ContentItem from '../../content_item/content_item';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ContentFetcher = async (source, contentType, id) => {
    let content = null;
    if (source === 'anilist') {
        content = await fetchAniListContent(contentType, id);
        if (content) {
            const title = contentType === ContentType.character ? `${content.name.first} ${content.name.last}` : content.title.english || content.title.romaji;
            const image = content.coverImage?.large || content.image?.large;
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
}

export default function Inventory({ inventoryIds, setInventoeryIds, source, contentType }) {
    const [inventoryContent, setInventoryContent] = useState([]);

    const fetchInventory = async () => {
        const fetchedInventory = [];
        for (let id of inventoryIds) {
            const content = await ContentFetcher(source, contentType, id);
            if (content) {
                fetchedInventory.push(content);
            }
        }
        setInventoryContent(fetchedInventory);
    };

    useEffect(() => {
        fetchInventory();
    }, [inventoryIds, source, contentType]);

    return (
        <Droppable className='inventory-drop' droppableId='inventory'>
            {(provided, snapshot) => (
                <div {...provided.droppableProps}
                    ref={provided.innerRef}
                    id='inventory' className='bg-white grid scrollable-results py-2 mb-2 overflow-auto'>
                    {inventoryContent.map((item, index) => (
                        <ContentItem key={item.id || item.mal_id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

