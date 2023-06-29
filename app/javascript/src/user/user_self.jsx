import React, { useState, useEffect, useRef } from 'react';
import './user.scss';
import NavBar from '../components/navbar/navbar';
import { ContentType } from '../utils/constants';
import { fetchFilteredUserTierLists, updateUser, deleteTierList } from '../utils/internal_apis/tierlist_apis';
import UserTierListColumn from '../components/user_tierlist_column/user_tierlist_column';
import { Modal, Button } from 'react-bootstrap';


export default function UserSelf({ userOnPage, setUserOnPage }) {
    const [contentType, setContentType] = useState(ContentType.anime);
    const [listFilter, setListFilter] = useState('all');
    const [tierLists, setTierLists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

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

    useEffect(() => {
        fetchTierLists();
    }, []);

    const fetchTierLists = async () => {
        try {
            const lists = await fetchFilteredUserTierLists(userOnPage.id, listFilter, contentType);
            console.log('lists', lists);
            setTierLists(lists);
        } catch (error) {
            console.error('Failed to fetch tier lists:', error);
        }
    };

    const initialRender = useRef(true);

    useEffect(() => { }, [tierLists]);

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

    const promptDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    }

    const handleDelete = async () => {
        if (deleteId) {
            await deleteTierList(deleteId);
            setShowModal(false);
            setDeleteId(null);
            // Fetch lists again after successful deletion
            fetchTierLists();
        }
    }

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
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.anime} checked={contentType === ContentType.anime} onChange={handleContentTypeChange} /> Anime</label>
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.manga} checked={contentType === ContentType.manga} onChange={handleContentTypeChange} /> Manga</label>
                                        <label className="radio-inline mx-1"><input type="radio" value={ContentType.character} checked={contentType === ContentType.character} onChange={handleContentTypeChange} /> Characters</label>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary" onClick={fetchTierLists}>Submit</button>
                                <div className="scrollable-div row">
                                    {tierLists && tierLists.map(item => (
                                        // Replace this with your list component
                                        <UserTierListColumn key={item.id} id={item.id} tierList={item} isOwner={true} onDelete={() => promptDelete(item.id)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this TierList?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </React.Fragment >
    );
}
