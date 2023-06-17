import React, { useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { fetchTierList, fetchInventory } from '../utils/fetch';
import AddFromAniListModal from '../components/add_content_modals/add_from_anilist_modal';
import AddFromMALModal from '../components/add_content_modals/add_from_mal_modal';
import { ContentType } from '../utils/constants';
import Inventory from '../components/inventory/inventory';
import Tier from '../components/tier/tier';

export default function CreateBuild({ tierListId }) {

    const [inventory, setInventory] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tierList, setTierList] = useState({
        title: '',
        description: '',
        source: '',
        content_type: '',
        tiers: []
    });

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                console.log('tier list at start create build', data);
                setTierList(data);
                setTiers(data.tiers);
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


    useEffect(() => {
        console.log(`inventory updated`, inventory);
    }, [inventory]);


    const addContentToInventory = (contentId) => {
        if (!inventory.includes(contentId)) {
            setInventory(prevInventory => [...prevInventory, contentId]);
        }
        console.log(`inventory after content id ${contentId} is added`, inventory);
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
            <div className="container-fluid bg-light pa-3">
                <div className="row">
                    <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                        <h1 className="my-2 ">Create(Build)</h1>
                        <div>
                            <a className="mx-2 my-2 btn btn-danger" href="/">Cancel</a>
                            <Button className="mx-2 my-2" >Save</Button>
                            <a className="mx-2 my-2 btn btn-primary" href="/">Post</a>
                        </div>
                    </div>
                    <div><a className="btn btn-primary text-light my-2" href="#">Share</a></div>
                    <div className="col-8 ">

                        <div id="ranks" className="row">
                            {tiers.map((tier, index) => (
                                <Tier
                                    key={tier.id} tier={tier} source={tierList.source} contentType={ContentType[tierList.content_type]}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="inventory-col col-4 ">
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                            <h3 className="my-2">Inventory</h3>
                            <Button className="my-2" onClick={handleOpenModal}>Add</Button>
                        </div>

                        <Inventory inventoryIds={inventory} source={tierList.source} contentType={ContentType[tierList.content_type]}
                        />

                        {tierList.source === 'anilist' && (
                            <AddFromAniListModal
                                tierList={tierList}
                                showModal={showModal}
                                handleCloseModal={handleCloseModal}
                                contentType={ContentType[tierList.content_type]}
                                source={tierList.source}
                                inventory={inventory}
                                addContentToInventory={addContentToInventory}
                            />
                        )}
                        {tierList.source === 'mal' && (
                            <AddFromMALModal
                                tierList={tierList}
                                showModal={showModal}
                                handleCloseModal={handleCloseModal}
                                contentType={ContentType[tierList.content_type]}
                                source={tierList.source}
                                inventory={inventory}
                                addContentToInventory={addContentToInventory}
                            />
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );

}
