import React, { useState, useEffect } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { BeatLoader } from "react-spinners";
import { fetchUserAnimeList, fetchUserMangaList, searchMALContent } from '../../utils/mal_api';
import { ContentType, AnimeStatus, MangaStatus } from '../../utils/constants';

export default function AddFromMALModal({ showModal, handleCloseModal, contentType, inventory, addContentToInventory, tierList }) {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState(contentType === ContentType.anime ? AnimeStatus[0] : MangaStatus[0]); // adjusted for manga
    const [userData, setUserData] = useState([]);

    const handleSearch = (event) => {
        event.preventDefault();
        setIsLoading(true);
        searchMALContent(contentType, searchInput)
            .then(result => {
                setSearchResults(result);
                console.log(searchResults);
                setIsLoading(false);
            });
    }

    const addAllToInventory = () => {
        userData.forEach(content => {
            const id = contentType === ContentType.character ? content.node.mal_id : content.node.id;
            if (id) {
                addContentToInventory(id);
            }
        });
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    }

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    }

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        if (contentType === ContentType.anime && Object.values(AnimeStatus).includes(newStatus)) {
            setStatus(newStatus);
        } else if (contentType === ContentType.manga && Object.values(MangaStatus).includes(newStatus)) {
            setStatus(newStatus);
        }
    }

    const fetchUserList = (event) => {
        event.preventDefault();

        if (contentType === ContentType.anime) {
            fetchUserAnimeList(userName, status).then(data => {
                setUserData(data);
                console.log(userData);
            });
        } else if (contentType === ContentType.manga) {
            fetchUserMangaList(userName, status).then(data => {
                setUserData(data);
                console.log(userData);
            });
        }
    }

    const SearchResult = ({ result, contentType, inventory, addContentToInventory }) => {
        const id = contentType === ContentType.character ? result.mal_id : result.id;
        return (
            <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center">
                    <img src={contentType === ContentType.character ? result.images.jpg.image_url : result.main_picture.large ||} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />
                    <h4 className="mb-0">{result.title || result.name}</h4>
                </div>
                <Button className="ml-auto ma-2" disabled={inventory.some(item => item === id)} onClick={() => addContentToInventory(id)}>Add</Button>
            </div>
        )
    }

    const SearchResultImport = ({ result, contentType, inventory, addContentToInventory }) => {
        return (
            <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center">
                    <img src={result.main_picture.large || result.main_picture.medium} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />
                    <h4 className="mb-0">{result.title}</h4>
                </div>
                <Button
                    className="ml-auto ma-2"
                    disabled={inventory.some(item => item === result.id)}
                    onClick={() => addContentToInventory(result.id)}
                >
                    Add
                </Button>
            </div>
        );
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="xl" className="my-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add {tierList.content_type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="tab1" id="uncontrolled-tab-example">
                    <Tab eventKey="tab1" title="Search">
                        <form className="d-flex mb-3" onSubmit={handleSearch}>
                            <input type="text" className="form-control" value={searchInput} onChange={handleSearchInputChange} placeholder={`${tierList.content_type} name`} />
                            <Button className="ml-2" type="submit">Search</Button>
                        </form>

                        <div className="scrollable-results py-2 w-100 h-80">
                            {isLoading
                                ? <BeatLoader color="#123abc" loading={isLoading} size={15} />
                                : searchResults?.map(result =>
                                    <SearchResult
                                        key={contentType === ContentType.character ? result.mal_id : result.node.id}
                                        result={contentType === ContentType.character ? result : result.node}
                                        contentType={contentType}
                                        inventory={inventory}
                                        addContentToInventory={addContentToInventory}
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
                                    placeholder={`${tierList.source} username`}
                                    disabled={ContentType[tierList.content_type] === ContentType.character}
                                />
                                <select
                                    className="form-select ml-2"
                                    value={status}
                                    onChange={handleStatusChange}
                                    disabled={ContentType[tierList.content_type] === ContentType.character}
                                >
                                    {(contentType === ContentType.anime ? Object.values(AnimeStatus) : Object.values(MangaStatus)).map((statusValue, index) => (
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
                                    <SearchResultImport key={result.node.id} result={result.node} contentType={contentType} inventory={inventory} addContentToInventory={addContentToInventory} />
                                )}
                        </div>
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
