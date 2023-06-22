import React, { useState, useEffect } from 'react';
import './create.scss';
import { Button } from 'react-bootstrap';
import { fetchTierList, fetchInventory, updateInventory, updateTier, createContent, fetchTiersFromTierList, fetchContentModel, } from '../utils/internal_apis/tierlist_apis';
import AddFromAniListModal from '../components/add_content_modals/add_from_anilist_modal';
import AddFromMALModal from '../components/add_content_modals/add_from_mal_modal';
import { ContentType } from '../utils/constants';
import Inventory from '../components/inventory/inventory';
import Tier from '../components/tier/tier';
import { DragDropContext } from 'react-beautiful-dnd';
import NavBar from '../components/navbar/navbar';


export default function CreateBuild({ tierListId }) {

    const [tierList, setTierList] = useState({});
    const [inventoryContentIds, setInventoryContentIds] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [allContentsAsApi, setAllContentsAsApi] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(async data => {
                setTierList(data);
                console.log('tier list data', data);
            }).catch(console.error);

            fetchInventory(tierListId).then(data => {
                if (!data.inventory.content_ids) {
                    setInventoryContentIds([]);
                } else {
                    console.log('inventory data', data);
                    setInventoryContentIds(data.content_ids);
                }
            });

            fetchTiersFromTierList(tierListId).then(data => {
                setTiers(data);
                console.log('tiers data', data);
                const tierContentIds = data.flatMap(tier => tier.content_ids);
                console.log('tier content ids', tierContentIds);
                setAllContentsAsApi(prevState => [...prevState, ...tierContentIds]);
                console.log('tiers data', data);
            });
        }
    }, [tierListId]);

    useEffect(() => {
        if (inventoryContentIds) {
            updateInventory(tierListId, inventoryContentIds)
                .then(updatedInventory => {
                    console.log("Updated inventory:", updatedInventory);
                })
                .catch(error => {
                    console.error("Error updating inventory:", error);
                });
        }
    }, [inventoryContentIds, tierListId]);

    useEffect(() => {
        tiers && tiers.forEach(tier => {
            updateTier(tier.id, tier.contents).then(data => {
                console.log('tier data updated', data);
            }).catch(console.error);
        });
    }, [tiers]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const isApiAlreadyAdded = (apiId) => {
        console.log('Checking if apiId is already added:', apiId);
        console.log('allContentsAsApi:', allContentsAsApi);
        if (!allContentsAsApi) return false;
        return allContentsAsApi.includes(apiId);
    };

    const createContentAndUpdateInventory = async (apiId, name, imageUrl) => {
        try {
            const contentId = await createContent(apiId, name, imageUrl);
            console.log('content id to add', contentId);

            setInventoryContentIds(prevInventoryContentIds => [...(prevInventoryContentIds || []), contentId]);

            setAllContentsAsApi(prevApiIds => {
                const newApiIds = [...(prevApiIds || []), apiId];
                console.log('Updated allContentsAsApi:', newApiIds);
                return newApiIds;
            });

            console.log("Content added to the inventory successfully.");

        } catch (error) {
            console.error("Error adding content to inventory:", error);
        }
    };


    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = source.droppableId === 'inventory' ? inventory : tiers[source.droppableId];
        const finish = destination.droppableId === 'inventory' ? inventory : tiers[destination.droppableId];

        // Moving within the same list
        if (start === finish) {
            const newList = Array.from(start.content_ids);
            newList.splice(source.index, 1);
            newList.splice(destination.index, 0, draggableId);

            if (start === inventory) {
                setInventory({ ...inventory, content_ids: newList });
            } else {
                setTiers(prevState => prevState.map(tier => tier.id === start.id ? { ...tier, content_ids: newList } : tier));
            }
        } else {
            // Moving from one list to another
            const startList = Array.from(start.content_ids);
            startList.splice(source.index, 1);
            const finishList = Array.from(finish.content_ids);
            finishList.splice(destination.index, 0, draggableId);

            if (start === inventory) {
                setInventory({ ...inventory, content_ids: startList });
                setTiers(prevState => prevState.map(tier => tier.id === finish.id ? { ...tier, content_ids: finishList } : tier));
            } else if (finish === inventory) {
                setTiers(prevState => prevState.map(tier => tier.id === start.id ? { ...tier, content_ids: startList } : tier));
                setInventory({ ...inventory, content_ids: finishList });
            } else {
                setTiers(prevState => {
                    return prevState.map(tier => {
                        if (tier.id === start.id) {
                            return { ...tier, content_ids: startList };
                        } else if (tier.id === finish.id) {
                            return { ...tier, content_ids: finishList };
                        } else {
                            return tier;
                        }
                    });
                });
            }
        }
    };


    if (!tierList) return 'Loading...';

    return (
        <React.Fragment>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
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
                                {tiers && tiers.map((tier, index) => (
                                    <Tier
                                        key={tier.id} tier={tier} tierIndex={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="inventory-col col-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between">
                                <h3 className="my-2">Inventory</h3>
                                <Button className="my-2" onClick={handleOpenModal}>Add</Button>
                            </div>
                            <Inventory inventoryContentIds={inventoryContentIds} setInventoryContentIds={setInventoryContentIds} source={tierList.source} contentType={ContentType[tierList.content_type]} />

                            {tierList.source === 'anilist' && (
                                <AddFromAniListModal
                                    tierList={tierList}
                                    showModal={showModal}
                                    handleCloseModal={handleCloseModal}
                                    contentType={ContentType[tierList.content_type]}
                                    inventoryContent={inventoryContentIds}
                                    addContentToInventory={createContentAndUpdateInventory}
                                    isApiAlreadyAdded={isApiAlreadyAdded}
                                />
                            )}

                            {tierList.source === 'mal' && (
                                <AddFromMALModal
                                    tierList={tierList}
                                    showModal={showModal}
                                    handleCloseModal={handleCloseModal}
                                    contentType={ContentType[tierList.content_type]}
                                    inventoryContent={inventoryContentIds}
                                    addContentToInventory={createContentAndUpdateInventory}
                                    isApiAlreadyAdded={isApiAlreadyAdded}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </React.Fragment>
    );
}
