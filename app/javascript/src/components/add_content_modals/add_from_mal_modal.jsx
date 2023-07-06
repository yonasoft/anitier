import React, { useState, useEffect } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { BeatLoader } from "react-spinners";
import { fetchUserAnimeList, fetchUserMangaList, searchMALContent } from '../../utils/external_apis/mal_api';
import { ContentType, AnimeStatus, MangaStatus } from '../../utils/constants';
import './add_modal.scss';
import { SearchResult, SearchResultImport } from './content_result/search_result';



export default function AddFromMALModal({ showModal, handleCloseModal, inventory, addContentToInventory, tierList, isApiAlreadyAdded }) {
    const initialStatus = ContentType[tierList.content_type] === ContentType.anime ? AnimeStatus[0] : MangaStatus[0];

    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState(initialStatus);
    const [userData, setUserData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearchInputChange = (event) => { setSearchInput(event.target.value); };
    const handleUserNameChange = (event) => { setUserName(event.target.value); };
    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        if (ContentType[tierList.content_type] === ContentType.anime && Object.values(AnimeStatus).includes(newStatus)) {
            setStatus(newStatus);
        } else if (ContentType[tierList.content_type] === ContentType.manga && Object.values(MangaStatus).includes(newStatus)) {
            setStatus(newStatus);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setIsLoading(true);
        searchMALContent(ContentType[tierList.content_type], searchInput)
            .then(result => {
                setSearchResults(result);
                setIsLoading(false);
            });
    };

    const fetchUserList = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const fetchFunction = ContentType[tierList.content_type] === ContentType.anime ? fetchUserAnimeList : fetchUserMangaList;
        fetchFunction(userName, status)
            .then(data => {
                console.log('mal user list', data);
                if (!data || data.length === 0) {
                    setErrorMessage(`User ${userName} not found or user's list is empty.`);
                } else {
                    console.log('user data', data);
                    setUserData(data);
                }
            })
            .catch(error => {
                console.error(error.message);
                setErrorMessage(error.message);
            });
    };

    const addAllToInventory = () => {

        userData.forEach(async content => {
            const contentNode = content.node;

            console.log('content', content);
            const id = ContentType[tierList.content_type] === ContentType.character ? contentNode.mal_id : contentNode.id;
            const name = contentNode.title
            const imageUrl = contentNode.main_picture.large
            console.log('id', id);
            console.log('name', name);
            console.log('imageUrl', imageUrl);

            addContentToInventory(id, name, imageUrl);
        })
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" className="my-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add {tierList.content_type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="tab1" id="uncontrolled-tab-example">
                    <Tab eventKey="tab1" title="Search">
                        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                        <form className="d-flex mb-3" onSubmit={handleSearch}>
                            <input type="text" className="form-control" value={searchInput} onChange={handleSearchInputChange} placeholder={`${tierList.content_type} name`} />
                            <Button className="ml-2" type="submit">Search</Button>
                        </form>
                        <div className="scrollable-results py-2 w-100 h-80">
                            {isLoading
                                ? <BeatLoader color="#123abc" loading={isLoading} size={15} />
                                : searchResults?.map(result =>
                                    <SearchResult
                                        key={ContentType[tierList.content_type] === ContentType.character ? result.mal_id : result.node.id}
                                        result={ContentType[tierList.content_type] === ContentType.character ? result : result.node}
                                        inventory={inventory}
                                        addContentToInventory={addContentToInventory}
                                        isApiAlreadyAdded={isApiAlreadyAdded}
                                    />
                                )
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="tab2" title="Import">
                        {(ContentType[tierList.content_type] === ContentType.character) ? <h1>Not available for My Anime List characters</h1> : <div></div>}
                        <div>
                            <form className="d-flex mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                    placeholder={`MAL username`}
                                    disabled={ContentType[tierList.content_type] === ContentType.character}
                                />
                                <select
                                    className="form-select ml-2"
                                    value={status}
                                    onChange={handleStatusChange}
                                    disabled={ContentType[tierList.content_type] === ContentType.character}
                                >
                                    {(ContentType[tierList.content_type] === ContentType.anime ? Object.values(AnimeStatus) : Object.values(MangaStatus)).map((statusValue, index) => (
                                        <option key={index} value={statusValue}>{statusValue}</option>
                                    ))}
                                </select>

                                <Button className="ml-2" type="button" onClick={fetchUserList} disabled={
                                    ContentType[tierList.content_type] === ContentType.character}>Fetch</Button>
                            </form>
                            <Button className="my-2" onClick={addAllToInventory} disabled={ContentType[tierList.content_type] === ContentType.character}>Add All</Button>
                        </div>
                        <div className="scrollable-results py-2 w-100 h-80">
                            {isLoading
                                ? <BeatLoader color="#123abc" loading={isLoading} size={15} />
                                : userData?.map(result =>
                                    <SearchResultImport key={result.node.id} result={result.node} inventory={inventory} addContentToInventory={addContentToInventory} isApiAlreadyAdded={isApiAlreadyAdded} />
                                )}
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button className="close" variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
