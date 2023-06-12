import React, { useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { fetchTierList, fetchInventory } from '../../utils/fetch';
import { BeatLoader } from "react-spinners";
import { CONTENT_SEARCH_PER_PAGE, ContentType, AniListStatus } from '../../utils/constants';
import { searchAniListContent, fetchUserAniListAnimeList, fetchUserAniListMangaList } from '../../utils/anilist_api';

//TODO: pagination, turn modal to its own component, and create mal modal

export default function CreateBuild({ tierListId }) {

    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [contentType, setContentType] = useState(0)
    const [userName, setUserName] = useState('');  // For input field
    const [status, setStatus] = useState(AniListStatus.CURRENT);  // For select field
    const [userData, setUserData] = useState([]);
    const [tierList, setTierList] = useState({
        title: '',
        description: '',
        source: '', // added
        content_type: '', // added
        tiers: []
    });

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                setTierList(data);
                setContentType(ContentType[data.content_type]);
            }).catch(error => {
                console.error(error);
            });
            fetchInventory(tierListId).then(data => {
                if (Array.isArray(data.contents)) {
                    setInventory(data.contents);
                } else {
                    console.error('Inventory contents data is not an array: ', data.contents);
                    setInventory([]);
                }
            }).catch(error => {
                console.error(error);
                setInventory([]);
            });

        }
    }, [tierListId]);


    const handleTitleChange = (event) => {
        setTierList(prevState => ({
            ...prevState,
            title: event.target.value
        }));
    }
    const handleSearch = (event) => {
        event.preventDefault();
        setIsLoading(true);  // Start loading animation
        const source = tierList.source;
        if (source === 'anilist') {
            searchAniListContent(contentType, searchInput, page, CONTENT_SEARCH_PER_PAGE) // Pass the page and perPage parameters
                .then(result => {
                    setSearchResults(result);
                    setIsLoading(false);  // Stop loading animation
                });
        } else if (source === 'MAL') {
            // Handle MAL source
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
        handleSearch();
    }


    const handleDescriptionChange = (event) => {
        setTierList(prevState => ({
            ...prevState,
            description: event.target.value
        }));
    }

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    }

    const addContentToTier = (tierId, content) => {
        setTierList(prevTierList => ({
            ...prevTierList,
            tiers: prevTierList.tiers.map(tier =>
                tier.id === tierId
                    ? { ...tier, contents: [...tier.contents, content] }
                    : tier
            )
        }));
    }

    const removeContentFromTier = (tierId, contentId) => {
        setTierList(prevTierList => ({
            ...prevTierList,
            tiers: prevTierList.tiers.map(tier =>
                tier.id === tierId
                    ? { ...tier, contents: tier.contents.filter(content => content.id !== contentId) }
                    : tier
            )
        }));
    }

    const addContentToInventory = (content) => {
        if (!inventory.some(item => item.id === content.id)) {
            setInventory(prevInventory => [...prevInventory, content.id]);
        }
        console.log(`inventory after content id ${content.id} is added`, inventory);
    }

    const addAllToInventory = () => {
        userData.forEach(list => {
            list.entries.forEach(content => {
                addContentToInventory(content.media);
                console.log("media id is", content.media.id);
            });
        });
        console.log("inventory after adding all content", inventory);
    }

    const removeContentFromInventory = (contentId) => {
        setInventory(prevInventory => prevInventory.filter(content => content.id !== contentId));
    }

    const moveContentFromInventoryToTier = (contentId, tierId) => {
        const content = inventory.find(item => item.id === contentId);
        if (content) {
            removeContentFromInventory(contentId);
            addContentToTier(tierId, content);
        }
    }

    const moveContentFromTierToInventory = (tierId, contentId) => {
        const tier = tierList.tiers.find(tier => tier.id === tierId);
        const content = tier?.contents.find(content => content.id === contentId);
        if (content) {
            removeContentFromTier(tierId, contentId);
            addContentToInventory(content);
        }
    }

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const fetchUserList = (event) => {
        event.preventDefault();

        if (contentType === ContentType.anime) {
            fetchUserAniListAnimeList(userName, status).then(data => {
                setUserData(data);
                console.log('user data:', userData);
            });
        } else if (contentType === ContentType.manga) {
            fetchUserAniListMangaList(userName, status).then(data => {
                setUserData(data);
                console.log('user data:', data);
            });
        }

    }

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    if (!tierList) {
        return 'Loading...';
    }

    const SearchResult = ({ result, contentType, inventory, addContentToInventory }) => {
        return (
            <div className="result-item d-flex justify-content-between align-items-center py-2 px-3">
                <div className="d-flex align-items-center">
                    <img src={result.coverImage.large || result.image.large} style={{ height: '60px', width: '60px', marginRight: '10px' }} alt="content" />
                    <h4 className="mb-0">{contentType === ContentType.character ? `${result.name.first} ${result.name.last}` : result.title.english || result.title.romaji}</h4>
                </div>
                <Button className="ml-auto ma-2" disabled={inventory.some(item => item.id === result.id)} onClick={() => addContentToInventory(result)}>Add</Button>
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
                    disabled={inventory.some(item => item.id === result.media.id)}
                    onClick={() => addContentToInventory(result.media)}
                >
                    Add
                </Button>
            </div>
        )
    }

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                        <h1 className="my-2 ">Create(Build)</h1>
                        <div>
                            <a className="mx-2 my-2 btn btn-danger" href="/">Cancel</a>
                            <Button className="mx-2 my-2" >Save</Button>
                            <a className="mx-2 my-2 btn btn-primary" href="/">Post</a>
                        </div>
                    </div>
                    <div className="col-8 ">
                        <a className="btn btn-primary text-light my-2" href="#">Share</a>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="title" value={tierList.title} onChange={handleTitleChange} />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" id="description" rows="2" style={{ height: "100%" }} value={tierList.description} onChange={handleDescriptionChange} />
                            <label htmlFor="description">Description(optional)</label>
                        </div>

                        <div id="ranks" className="row">
                            {tierList.tiers.map((tier, index) => (
                                <div key={index} className="d-flex w-100 border-dark" style={{ height: "100px" }}>
                                    <div className="text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: "#3F5C9E", width: "50px" }}>
                                        {tier.rank}
                                    </div>
                                    <div className="flex-grow-1 border-left p-2" style={{ backgroundColor: "white" }}>
                                        {/* This is where the contents associated with each tier would be displayed */}
                                    </div>
                                    <hr className="my-3" style={{ borderColor: "black" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-4 ">
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                            <h3 className="my-2">Inventory</h3>
                            <Button className="my-2" onClick={handleOpenModal}>Add</Button>
                        </div>
                        <div id='inventory' className='bg-white'></div>
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
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
