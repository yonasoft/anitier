import React, { useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { fetchTierList, fetchInventory } from '../../utils/fetch';

export default function CreateBuild({ tierListId }) {

    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tierList, setTierList] = useState({
        title: '',
        description: '',
        tiers: []
    });

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                setTierList(data);
            }).catch(error => {
                console.error(error);
            });

            fetchInventory(tierListId).then(data => {
                setInventory(data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [tierListId]);

    const handleTitleChange = (event) => {
        setTierList(prevState => ({
            ...prevState,
            title: event.target.value
        }));
    }

    const handleDescriptionChange = (event) => {
        setTierList(prevState => ({
            ...prevState,
            description: event.target.value
        }));
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
        setInventory(prevInventory => [...prevInventory, content]);
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


    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    if (!tierList) {
        return 'Loading...';
    }

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                        <h1 className="my-2 ">Create(Build)</h1>
                        <div>
                            <a className="mx-2 my-2 btn btn-secondary" href="/">Cancel</a>
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
                        <div className='d-flex flex-column flex-md-row justify-content-between'>
                            <h3 className="my-2 ">Inventory</h3>
                            <Button className="my-2 mt-md-0" onClick={handleOpenModal}>Add</Button>
                            <div id='inventory' className='bg-white'>
                            </div>
                        </div>
                        <div className="inventor row bg-secondary w-100"></div>
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Items</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Tabs defaultActiveKey="tab1" id="uncontrolled-tab-example">
                                    <Tab eventKey="tab1" title="Search">
                                        {/* content for Tab 1 */}
                                    </Tab>
                                    <Tab eventKey="tab2" title="Import">
                                        {/* content for Tab 2 */}
                                    </Tab>
                                </Tabs>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleCloseModal}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
