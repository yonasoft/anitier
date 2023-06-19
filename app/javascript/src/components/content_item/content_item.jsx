import React, { useState, useEffect } from 'react';
import './content_item.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ContentItem({ item, index }) {
    console.log('item', item);
    const id = item.mal_id || item.id;
    const image = (item.image?.large || item?.image || item.coverImage?.large || item.main_picture?.large || item.main_picture?.medium || item.images.jpg.image_url);
    const name = item.title?.english || item.title?.romaji || item?.title || (item.name?.first ? `${item.name.first} ${item.name.last}` : item.name);

    return (
        <Draggable key={id} draggableId={id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ userSelect: 'none', ...provided.draggableProps.style }}
                    className='content-item'

                >
                    {image && <img className='content-image' src={image} alt={name} />}
                    <div className='content-title'>{name}</div>
                </div>)}
        </Draggable>
    );
}
