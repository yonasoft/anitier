import React, { useState, useEffect } from 'react';
import './content_item.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ContentItem({ item, index }) {
    console.log('item', item);
    const id = item.api_id
    const image = item.image_url
    const name = item.name

    return (
        <Draggable key={id} draggableId={id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ userSelect: 'none', ...provided.draggableProps.style, backgroundColor: snapshot.isDragging ? '#263B4A' : '#FFFFFF' }}
                    className='content-item'
                >
                    {image && <img className='content-image' src={image} alt={name} />}
                    <div className='content-title'>{name}</div>
                </div>)}
        </Draggable>
    );
}
