import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar';
import { Button } from 'react-bootstrap';
import { createContent, updateInventory, updateTier } from '../utils/internal_apis/tierlist_apis';
import AddFromAniListModal from '../components/add_content_modals/add_from_anilist_modal';
import AddFromMALModal from '../components/add_content_modals/add_from_mal_modal';
import { ContentType } from '../utils/constants';
import Inventory from '../components/inventory/inventory';
import Tier from '../components/tier/tier';
import { DragDropContext } from 'react-beautiful-dnd';

export default function OwnerTierList({ tierList, setTierList, inventoryContentIds, setInventoryContentIds, tiers, setTiers, allContentsAsApi }) {


    const [showModal, setShowModal] = useState(false);
    const handleInputChange = (event) => { setTierList({ ...tierList, [event.target.id]: event.target.value }); }
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        if (inventoryContentIds) {
            updateInventory(tierList.id, inventoryContentIds)
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
            console.log('tier id when updated and content ids', tier.id, tier.content_ids);
            updateTier(tier.id, tier.content_ids).then(data => {
                console.log('tier data updated', data);
            }).catch(console.error);
        });
    }, [tiers]);

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

    const adjustTier = (tier, sourceIndex, destinationIndex, draggableId) => {
        console.log('tier in updateTier', tier);
        const copy = Array.from(tier.content_ids);

        if (sourceIndex !== null) {
            copy.splice(sourceIndex, 1);
        }

        if (destinationIndex !== null) {
            copy.splice(destinationIndex, 0, parseInt(draggableId));
        }

        return {
            ...tier,
            content_ids: copy,
        };
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        console.log("source:", source);
        console.log("destination:", destination);
        console.log("tiers:", tiers);

        if (source.droppableId === 'inventory') {
            const start = inventoryContentIds;
            const finish = tiers[parseInt(destination.droppableId)];

            const startCopy = Array.from(start);
            const finishCopy = Array.from(finish.content_ids);

            console.log('draggable id', draggableId);
            startCopy.splice(source.index, 1);
            finishCopy.splice(destination.index, 0, parseInt(draggableId));

            setInventoryContentIds([...startCopy]);

            const newTier = {
                ...finish,
                content_ids: finishCopy
            };

            const newTiers = [...tiers];
            newTiers[parseInt(destination.droppableId)] = newTier;

            setTiers(newTiers);
        }
        else {
            const start = tiers[parseInt(source.droppableId)];
            const finish = tiers[parseInt(destination.droppableId)];

            if (start === finish) {
                const startCopy = Array.from(start.content_ids);
                console.log('draggable id', draggableId);
                startCopy.splice(source.index, 1);
                startCopy.splice(destination.index, 0, parseInt(draggableId));

                const newTier = {
                    ...start,
                    content_ids: startCopy
                };

                const newTiers = [...tiers];
                newTiers[parseInt(source.droppableId)] = newTier;

                setTiers(newTiers);
            }
            if (destination.droppableId === 'inventory') {
                const start = tiers[parseInt(source.droppableId)];
                const startCopy = Array.from(start.content_ids);

                console.log('draggable id', draggableId);
                startCopy.splice(source.index, 1);

                const newTier = {
                    ...start,
                    content_ids: startCopy
                };

                const newTiers = [...tiers];
                newTiers[parseInt(source.droppableId)] = newTier;

                setTiers(newTiers);

                const inventoryCopy = Array.from(inventoryContentIds);
                inventoryCopy.splice(destination.index, 0, parseInt(draggableId));
                setInventoryContentIds(inventoryCopy);
            } else {
                const start = tiers[parseInt(source.droppableId)];
                const finish = tiers[parseInt(destination.droppableId)];

                if (start === finish) {
                    console.log('draggable id', draggableId);
                    const newTier = adjustTier(start, source.index, destination.index, draggableId);
                    const newTiers = [...tiers];
                    newTiers[parseInt(source.droppableId)] = newTier;
                    setTiers(newTiers);
                } else {
                    console.log('draggable id', draggableId);
                    const newStart = adjustTier(start, source.index, null, draggableId);
                    const newFinish = adjustTier(finish, null, destination.index, draggableId); // Note the change from 'ajustTier' to 'adjustTier' here
                    const newTiers = [...tiers];
                    newTiers[parseInt(source.droppableId)] = newStart;
                    newTiers[parseInt(destination.droppableId)] = newFinish;
                    setTiers(newTiers);
                }
            }
        }
    };


    if (!tierList) return 'Loading...';

    return (
        <React.Fragment>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <NavBar />
                <div className="container bg-light pa-3">
                    <div className="row">
                        <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                            <h1 className="my-2">Create(Build)</h1>
                            <div>
                                <a className="mx-2 my-2 btn btn-secondary" href="/" title='Finish tier list creation'>Finish</a>
                                <a className="mx-2 my-2 btn btn-primary" href="/" title='Make your tier list public'>Post</a>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="form-floating my-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    defaultValue={tierList.title}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="title">Title</label>
                            </div>
                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    id="description"
                                    rows="3"
                                    style={{ height: "100%" }}
                                    defaultValue={tierList.description}
                                    onChange={handleInputChange}
                                ></textarea>
                                <label htmlFor="description">Description(optional)</label>
                            </div>

                        </div>
                        <div className="col-8">
                            <div><a className="btn btn-primary text-light my-2" href="#">Share</a></div>
                            <div id="ranks" className="row">
                                {tiers && tiers.map((tier, index) => (
                                    <Tier
                                        key={index} tier={tier} tierIndex={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
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
