import React, { useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar';
import { Button } from 'react-bootstrap';
import { fetchTierList, fetchInventory } from '../utils/internal_apis/tierlist_apis';
import AddFromAniListModal from '../components/add_content_modals/add_from_anilist_modal';
import AddFromMALModal from '../components/add_content_modals/add_from_mal_modal';
import { ContentType } from '../utils/constants';
import Inventory from '../components/inventory/inventory';
import Tier from '../components/tier/tier';

export default function CreateBuild({ tierListId }) {

    const [inventoryAPIds, setInventoryAPIds] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tierList, setTierList] = useState({
        source: '',
        content_type: '',
        tiers: []
    });

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                setTierList(data);
                setTiers(data.tiers);
            }).catch(console.error);

            fetchInventory(tierListId).then(data => {
                if (Array.isArray(data.contents)) {
                    setInventoryAPIds(data.contents);
                } else {
                    console.error('Inventory contents data is not an array: ', data.contents);
                    setInventoryAPIds([]);
                }
            }).catch(error => {
                console.error(error);
                setInventoryAPIds([]);
            });
        }
    }, [tierListId]);

    const isContentIdInInventory = (contentId) => inventoryAPIds.includes(contentId);

    const addContentToInventory = (contentId) => {
        if (!isContentIdInInventory(contentId)) {
            setInventoryAPIds(prevInventory => [...prevInventory, contentId]);
        }
    }

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    if (!tierList) return 'Loading...';

    return (
        <React.Fragment>
            <NavBar />
            <div className="container-fluid bg-light pa-3">
                <div className="row">
                    <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                        <h1 className="my-2">Create(Build)</h1>
                        <div>
                            <a className="mx-2 my-2 btn btn-secondary" href="/" title='Finish tier list creation'>Finish</a>
                            <a className="mx-2 my-2 btn btn-primary" href="/" title='Make your tier list public'>Post</a>
                        </div>
                    </div>
                    <div className="col-8">
                        <div><a className="btn btn-primary text-light my-2" href="#">Share</a></div>
                        <div id="ranks" className="row">
                            {tiers.map((tier, index) => (
                                <Tier
                                    key={tier.id} tier={tier} index={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="inventory-col col-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                            <h3 className="my-2">Inventory</h3>
                            <Button className="my-2" onClick={handleOpenModal}>Add</Button>
                        </div>
                        <Inventory inventoryIds={inventoryAPIds} setInventoeryIds={setInventoryAPIds} source={tierList.source} contentType={ContentType[tierList.content_type]} />
                        {tierList.source === 'anilist' && (
                            <AddFromAniListModal
                                tierList={tierList}
                                showModal={showModal}
                                handleCloseModal={handleCloseModal}
                                contentType={ContentType[tierList.content_type]}
                                inventory={inventoryAPIds}
                                addContentToInventory={addContentToInventory}
                            />
                        )}
                        {tierList.source === 'mal' && (
                            <AddFromMALModal
                                tierList={tierList}
                                showModal={showModal}
                                handleCloseModal={handleCloseModal}
                                contentType={ContentType[tierList.content_type]}
                                inventory={inventoryAPIds}
                                addContentToInventory={addContentToInventory}
                            />
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
