import React, { useState, useEffect } from 'react';
import { fetchAniListAnime, fetchAniListManga, fetchAniListCharacter, fetchAniListContent } from '../../utils/anilist_api';
import { fetchMALContentById } from '../../utils/mal_api';
import { ContentType } from '../../utils/constants'
import './inventory.scss';

const Inventory = ({ inventoryIds, source, contentType }) => {
    const [inventoryContent, setInventoryContent] = useState([]);

    useEffect(() => {
        const fetchContent = async (id) => {
            let content = null;
            if (source === 'anilist') {
                content = await fetchAniListContent(contentType, id)
                console.log('fetched content', content);
                if (content) {
                    const title = contentType === ContentType.character ? `${content.name.first} ${content.name.last}` : content.title.english || content.title.romaji
                    const image = content.coverImage?.large || content.image?.large
                    return { id: content.id, title, image };
                }
            } else if (source === 'mal') {
                content = await fetchMALContentById(contentType, id);
                console.log('fetched content', content);
                if (content) {
                    const title = content.title || content.name;
                    const image = contentType === ContentType.character ? content.images.jpg.image_url : content.main_picture.large
                    return { id: content.id || content.mal_id, title, image };
                }
            }
            return null;
        }

        const fetchInventory = async () => {
            const fetchedInventory = [];
            for (let id of inventoryIds) {
                const content = await fetchContent(id);
                if (content) {
                    fetchedInventory.push(content);
                }
            }
            setInventoryContent(fetchedInventory);
            console.log(fetchedInventory);
        }

        fetchInventory();
    }, [inventoryIds, source, contentType]);

    return (
        <div id='inventory' className='bg-white grid scrollable-results py-2 mb-2 overflow-auto'>
            {inventoryContent.map((item, index) => (
                <div key={index} className="inventory-item">
                    <img className="inventory-image" src={item.image} alt={item.title} />
                    <div className="inventory-title">{item.title}</div>
                </div>
            ))}
        </div>
    );

}

export default Inventory;
