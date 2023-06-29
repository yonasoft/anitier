import React, { useState, useEffect } from 'react';
import { ContentType } from '../../utils/constants'
import './inventory.scss';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ContentItem from '../content_item/content_item';
import { fetchContentModel } from '../../utils/internal_apis/tierlist_apis';

export default function Inventory({ inventoryContentIds }) {

    const [inventoryContent, setInventoryContent] = useState([]);
    useEffect(() => {
        console.log('inventoryContentIds in inventory', inventoryContentIds);
        const fetchContent = async () => {
            if (inventoryContentIds) {
                const contents = await Promise.all(inventoryContentIds.map(id => fetchContentModel(id)));
                console.log('inventory content', contents);
                setInventoryContent(contents);
            } else {
                console.log('inventoryContentIds is undefined');
            }
        };
        fetchContent();
    }, [inventoryContentIds]);


    return (
        <Droppable className='inventory-drop bg-light' droppableId='inventory'>
            {(provided, snapshot) => (
                <div {...provided.droppableProps}
                    ref={provided.innerRef}
                    id='inventory' className='bg-light grid scrollable-results py-2 mb-2 overflow-auto'>
                    {inventoryContent && inventoryContent.filter(item => item).map((item, index) => (
                        <ContentItem key={item.id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}

