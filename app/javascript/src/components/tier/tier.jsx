import React, { useState, useEffect } from 'react';
import { fetchAniListContent } from '../../utils/anilist_api';
import { fetchMALContentById } from '../../utils/mal_api';
import { ContentType } from '../../utils/constants';
import './tier.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const Tier = ({ tier, source, contentType }) => {
    const [apiIds, setApiIds] = useState([]);
    const [tierContent, setTierContent] = useState([]);


    useEffect(() => {
        const fetchContent = async (id) => {
            let content = null;
            if (source === 'anilist') {
                content = await fetchAniListContent(contentType, id)
                if (content) {
                    const title = contentType === ContentType.character ? `${content.name.first} ${content.name.last}` : content.title.english || content.title.romaji
                    const image = content.coverImage?.large || content.image?.large
                    return { id: content.id, title, image };
                }
            } else if (source === 'mal') {
                content = await fetchMALContentById(contentType, id);
                if (content) {
                    const title = content.title || content.name;
                    const image = contentType === ContentType.character ? content.images.jpg.image_url : content.main_picture.large
                    return { id: content.id || content.mal_id, title, image };
                }
            }
            return null;
        }

        const fetchTierContent = async () => {
            gatherApiIds();
            const fetchedContents = [];
            for (let id of apiIds) {
                const fetchedcontent = await fetchContent(id);
                if (fetchedcontent) {
                    fetchedContents.push(fetchedcontent);
                }
            }
            setTierContent(fetchedContents);
        }

        fetchTierContent();
    }, [tier, source, contentType]);

    const gatherApiIds = () => {
        const gatheredApiIds = [];
        for (content in tier.contents) {
            gatherApiIds.push(content.api_id);
        }
        setApiIds(gatheredApiIds);
        console.log('gathered api ids', gatheredApiIds);
    }

    return (
        <div className="d-flex w-100 border-dark" style={{ minHeight: "135px" }}>
            <div className="text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#3F5C9E", width: "75px" }}>
                {tier.rank}
            </div>
            <div className="content bg-white flex-grow-1 border-left p-2 d-flex flex-wrap align-content-start overflow-auto" style={{ backgroundColor: '#f7f7f7', maxHeight: "540px" }}>
                {tierContent.map((item, index) => (
                    <div key={index} className="content-item">
                        <img className="content-image" src={item.image} alt={item.title} />
                        <div className="content-title">{item.title}</div>
                    </div>
                ))}
            </div>
            <hr className="my-3" style={{ borderColor: "black" }} />
        </div>
    )
}

export default Tier;
