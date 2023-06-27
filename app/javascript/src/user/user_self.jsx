import React, { useState, useEffect, useRef } from 'react';
import './user.scss';
import NavBar from '../components/navbar/navbar';
import { ContentType } from '../utils/constants';
import { updateUser } from '../utils/internal_apis/tierlist_apis';


export default function UserSelf({ userOnPage, setUserOnPage }) {
    const [contentType, setContentType] = useState(ContentType.anime);
    const [listFilter, setListFilter] = useState('all');

    const handleContentTypeChange = (event) => setContentType(Number(event.target.value));
    const handleListFilterChange = (event) => setListFilter(event.target.value);
    const handleBioChange = (event) => {
        setUserOnPage(prevUser => ({ ...prevUser, bio: event.target.value }));
    };

    const handleMalUrlChange = (event) => {
        setUserOnPage(prevUser => ({ ...prevUser, mal_url: event.target.value }));
    };

    const handleAniListUrlChange = (event) => {
        setUserOnPage(prevUser => ({ ...prevUser, anilist_url: event.target.value }));
    };


    const initialRender = useRef(true);

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
                        <form>
                            <div className="form-group">
                                <label>MyAnimeList Link</label>
                                <input type="url" className="form-control" value={userOnPage.mal_url || ''} onChange={(e) => handleMalUrlChange(e)} placeholder="Enter MyAnimeList URL" />
                            </div>
                            <div className="form-group">
                                <label>AniList Link</label>
                                <input type="url" className="form-control" value={userOnPage.anilist_url || ''} onChange={(e) => handleAniListUrlChange(e)} placeholder="Enter AniList URL" />
                            </div>
                            <div className="form-group">
                                <label>Biography</label>
                                <textarea className="form-control my-2" rows="7" value={userOnPage.bio || ''} onChange={handleBioChange} placeholder="Enter biography" />
                            </div>
                        </form>
                    </div>
                    <div className="col-12 col-md-8 text-center">
                        <h3>Your Tier Lists</h3>
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8">
                                <div className="form-group">
                                    <label>Filter:</label>
                                    <select className="form-control" value={listFilter} onChange={handleListFilterChange}>
                                        <option value="all">All</option>
                                        <option value="posted">Posted</option>
                                        <option value="unposted">Unposted</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Content Type:</label>
                                    <div>
                                        <label className="radio-inline"><input type="radio" value={ContentType.anime} checked={contentType === ContentType.anime} onChange={handleContentTypeChange} /> Anime</label>
                                        <label className="radio-inline"><input type="radio" value={ContentType.manga} checked={contentType === ContentType.manga} onChange={handleContentTypeChange} /> Manga</label>
                                        <label className="radio-inline"><input type="radio" value={ContentType.character} checked={contentType === ContentType.character} onChange={handleContentTypeChange} /> Characters</label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
