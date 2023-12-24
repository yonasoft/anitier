import React from 'react';
import './content_item.scss';
import { Draggable } from 'react-beautiful-dnd';

export default function ContentItem({ id, item, index }) {
    if (!item) {
        return null;
    }

    const image = item.image_url;
    const name = item.name;

    return (
        <Draggable key={id} draggableId={item.id ? item.id.toString() : "0"} index={index}>
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
