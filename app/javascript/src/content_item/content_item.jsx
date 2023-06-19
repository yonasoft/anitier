import React, { useState, useEffect } from 'react';
import './content_item.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function ContentItem({ item, index }) {
    return (
        <div key={item.id || item.mal_id} index={index}>
            <div className='content-item'>
                <img className='content-image' src={item.image} alt={item.title} />
                <div className='content-title'>{item.title}</div>
            </div>
        </div>
    );
}
