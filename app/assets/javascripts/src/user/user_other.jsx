import React, { useState, useEffect, useRef } from 'react';
import './user.scss';
import NavBar from '../components/navbar/navbar';
import { ContentType } from '../utils/constants';
import { fetchFilteredUserTierLists, updateUser } from '../utils/internal_apis/tierlist_apis';
import UserTierListColumn from '../components/user_tierlist_column/user_tierlist_column';

export default function UserOther({ userOnPage }) {

    const [contentType, setContentType] = useState(ContentType.anime);
    const [tierLists, setTierLists] = useState([]);

    const initialRender = useRef(true);


    const fetchTierLists = async () => {
        try {
            const lists = await fetchFilteredUserTierLists(userOnPage.id, "posted", contentType);
            console.log('lists', lists);
            setTierLists(lists);
        } catch (error) {
            console.error('Failed to fetch tier lists:', error);
        }
    };

    useEffect(() => {
        fetchTierLists();
    }, []);
    useEffect(() => { }, [tierLists]);
    const handleContentTypeChange = (event) => setContentType(Number(event.target.value));

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            updateUser(userOnPage.id, userOnPage);
            console.log('userOnPage during update', userOnPage);
        }
    }, [userOnPage]);

    useEffect(() => {
        console.log('initial userOnPage', userOnPage);
        updateUser(userOnPage.id, userOnPage);
    }, [userOnPage]);



    return (
        <React.Fragment>
            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <h2 className="username">Your Profile</h2>

                        <h6>MyAnimeList Link</h6>
                        <a href={userOnPage.mal_url || ''}>{userOnPage.mal_url || ''}</a>
                        <h6>AniList Link</h6>
                        <a href={userOnPage.bio || ''}>{userOnPage.bio || ''}</a>

                        <h6>Biography</h6>
                        <p className='bio'>{userOnPage.bio || ''}</p>

                    </div>
                    <div className="col-12 col-md-8 text-center">
                        <h3>{userOnPage.username}'s Posted Tier Lists</h3>
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8">

                                <div className="form-group">
                                    <label>Content Type:</label>
                                    <div>
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.anime} checked={contentType === ContentType.anime} onChange={handleContentTypeChange} /> Anime</label>
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.manga} checked={contentType === ContentType.manga} onChange={handleContentTypeChange} /> Manga</label>
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.character} checked={contentType === ContentType.character} onChange={handleContentTypeChange} /> Characters</label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary" onClick={fetchTierLists}>Submit</button>
                                <div className="scrollable-div row">
                                    {tierLists && tierLists.map(item => (
                                        // Replace this with your list component
                                        <UserTierListColumn key={item.id} id={item.id} tierList={item} isOwner={false} onDelete={() => { }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
