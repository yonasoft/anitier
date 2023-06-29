import React, { useState, useEffect } from 'react';
import './content_item.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ContentItemNonDraggable({ id, item, index }) {
    console.log('item', item);
    if (!item) {
        return null;
    }

    const image = item.image_url;
    const name = item.name;

    return (

        <div className='content-item'>
            {image && <img className='content-image' src={image} alt={name} />}
            <div className='content-title'>{name}</div>
        </div>

    );
}
