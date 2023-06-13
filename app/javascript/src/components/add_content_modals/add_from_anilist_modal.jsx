import React, { useState, useEffect } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { ContentType, AniListStatus } from '../../utils/constants'
import { searchAniListContent, fetchUserAniListAnimeList, fetchUserAniListMangaList } from '../../utils/anilist_api';
import { BeatLoader } from "react-spinners";
import './add_modal.scss';

export default function AddFromAniListModal({ showModal, handleCloseModal, contentType, inventory, addContentToInventory, tierList }) {

    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState(AniListStatus.CURRENT);
    const [userData, setUserData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        console.log("inventory after adding all content", inventory);
    }, [inventory]);

    const handleSearch = (event) => {
        event.preventDefault();
        setIsLoading(true);
        searchAniListContent(contentType, searchInput)
            .then(result => {
                setSearchResults(result);
                setIsLoading(false);
            });

    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    }

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const fetchUserList = (event) => {
        event.preventDefault();
        setErrorMessage('');

        const fetchFunction = contentType === ContentType.anime ? fetchUserAniListAnimeList : fetchUserAniListMangaList;

        fetchFunction(userName, status)
            .then(data => {
                if (!data || data.length === 0) {
                    setErrorMessage(`User ${userName} not found or user's list is empty.`);
                } else {
                    setUserData(data);
                }
            })
            .catch(error => {
                console.error(error.message);
                setErrorMessage(`No user data found`);
            });
    }

    const addAllToInventory = () => {
        userData.forEach(list => {
            list.entries.forEach(content => {
                if (content.media) {
                    addContentToInventory(content.media.id);
                }
            });
        });
    }

    const SearchResult = ({ result, contentType, inventory, addContentToInventory }) => {
        return (
            <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center">
                    <img src={result.coverImage?.large || result.image?.large} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />
                    <h4 className="mb-0">{contentType === ContentType.character ? `${result.name.first} ${result.name.last}` : result.title.english || result.title.romaji}</h4>
                </div>
                <Button className="ml-auto ma-2" disabled={inventory.some(item => item === result.id)} onClick={() => addContentToInventory(result.id)}>Add</Button>
            </div>
        )
    }

    const SearchResultImport = ({ result, contentType, inventory, addContentToInventory }) => {
        const coverImage = result.media.coverImage?.large;

        return (
            <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center">
                    {coverImage && <img src={coverImage} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />}
                    <h4 className="mb-0">{contentType === ContentType.character ? `${result.media.name.first} ${result.media.name.last}` : result.media.title.english || result.media.title.romaji}</h4>
                </div>
                <Button
                    className="ml-auto ma-2"
                    disabled={inventory.some(item => item === result.media.id)}
                    onClick={() => addContentToInventory(result.media.id)}
                >
                    Add
                </Button>
            </div>
        )
    }

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
                            {isLoading ? <BeatLoader color="#123abc" loading={isLoading} size={15} /> :
                                searchResults.map(result =>
                                    <SearchResult key={result.id} result={result} contentType={contentType} inventory={inventory} addContentToInventory={addContentToInventory} />
                                )
                            }
                        </div>
                    </Tab>
                    <Tab eventKey="tab2" title="Import">
                        {(tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character) ? <h1>Not available for Anilist characters</h1> : <div></div>}
                        <div>
                            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                            <form className="d-flex mb-3">

                                <input
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                    placeholder={`${tierList.source} username`}
                                    disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}
                                />
                                <select
                                    className="form-select ml-2"
                                    value={status}
                                    onChange={handleStatusChange}
                                    disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}
                                >
                                    {Object.values(AniListStatus).map((statusValue, index) => (
                                        <option key={index} value={statusValue}>{statusValue}</option>
                                    ))}
                                </select>
                                <Button className="ml-2" type="button" onClick={fetchUserList} disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}>Fetch</Button>
                            </form>
                            <Button className="my-2" onClick={addAllToInventory} disabled={tierList.source === 'anilist' && ContentType[tierList.content_type] === ContentType.character}>Add All</Button>
                        </div>
                        <div className="scrollable-results py-2 w-100 h-80">
                            {userData.map(list =>
                                list.entries.map(result =>
                                    result.media && <SearchResultImport key={result.media.id} result={result} contentType={contentType} inventory={inventory} addContentToInventory={addContentToInventory} />
                                )
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
