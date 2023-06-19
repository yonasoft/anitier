import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar';
import { Button } from 'react-bootstrap';
import { updateTier } from '../utils/internal_apis/tierlist_apis';
import AddFromAniListModal from '../components/add_content_modals/add_from_anilist_modal';
import AddFromMALModal from '../components/add_content_modals/add_from_mal_modal';
import { ContentType } from '../utils/constants';
import Inventory from '../components/inventory/inventory';
import Tier from '../components/tier/tier';
import { DragDropContext } from 'react-beautiful-dnd';

export default function OwnerTierList(tierList, inventoryAPIds, setInventoryAPIds, tiers, setTiers) {

    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        updateInventory(tierListId, inventoryAPIds)
            .catch(console.error);
        tiers.forEach(tier => {
            updateTier(tier.id, tier.contents)
                .catch(console.error);
        });
    }, [inventoryAPIds, tiers]);

    const isContentIdInInventory = (contentId) => inventoryAPIds.includes(contentId);

    const addContentToInventory = (contentId) => {
        if (!isContentIdInInventory(contentId)) {
            setInventoryAPIds(prevInventory => [...prevInventory, contentId]);
        }
    }

    const updateTierState = (tier, sourceIndex, destinationIndex, draggableId) => {
        console.log('tier in updateTier', tier);
        const copy = Array.from(tier.contents);

        // If sourceIndex is not null, we're moving an item from it
        if (sourceIndex !== null) {
            copy.splice(sourceIndex, 1);
        }

        // If destinationIndex is not null, we're adding an item to it
        if (destinationIndex !== null) {
            copy.splice(destinationIndex, 0, parseInt(draggableId));
        }

        return {
            ...tier,
            contents: copy,
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
            const start = inventoryAPIds;
            const finish = tiers[parseInt(destination.droppableId)];

            const startCopy = Array.from(start);
            const finishCopy = Array.from(finish.contents);

            console.log('draggable id', draggableId);
            startCopy.splice(source.index, 1);
            finishCopy.splice(destination.index, 0, parseInt(draggableId));

            setInventoryAPIds([...startCopy]);

            const newTier = {
                ...finish,
                contents: finishCopy
            };

            const newTiers = [...tiers];
            newTiers[parseInt(destination.droppableId)] = newTier;

            setTiers(newTiers);
        }
        else {
            const start = tiers[parseInt(source.droppableId)];
            const finish = tiers[parseInt(destination.droppableId)];

            if (start === finish) {
                const startCopy = Array.from(start.contents);
                console.log('draggable id', draggableId);
                startCopy.splice(source.index, 1);
                startCopy.splice(destination.index, 0, parseInt(draggableId));

                const newTier = {
                    ...start,
                    contents: startCopy
                };

                const newTiers = [...tiers];
                newTiers[parseInt(source.droppableId)] = newTier;

                setTiers(newTiers);
            }
            if (destination.droppableId === 'inventory') {
                const start = tiers[parseInt(source.droppableId)];
                const startCopy = Array.from(start.contents);

                console.log('draggable id', draggableId);
                startCopy.splice(source.index, 1);

                const newTier = {
                    ...start,
                    contents: startCopy
                };

                const newTiers = [...tiers];
                newTiers[parseInt(source.droppableId)] = newTier;

                setTiers(newTiers);

                const inventoryCopy = Array.from(inventoryAPIds);
                inventoryCopy.splice(destination.index, 0, parseInt(draggableId));
                setInventoryAPIds(inventoryCopy);
            } else {
                const start = tiers[parseInt(source.droppableId)];
                const finish = tiers[parseInt(destination.droppableId)];

                if (start === finish) {
                    console.log('draggable id', draggableId);
                    const newTier = updateTierState(start, source.index, destination.index, draggableId);
                    const newTiers = [...tiers];
                    newTiers[parseInt(source.droppableId)] = newTier;
                    setTiers(newTiers);
                } else {
                    console.log('draggable id', draggableId);
                    const newStart = updateTierState(start, source.index, null, draggableId);
                    const newFinish = updateTierState(finish, null, destination.index, draggableId);
                    const newTiers = [...tiers];
                    newTiers[parseInt(source.droppableId)] = newStart;
                    newTiers[parseInt(destination.droppableId)] = newFinish;
                    setTiers(newTiers);
                }
            }
        }
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    if (!tierList) return 'Loading...';

    return (
        <React.Fragment>
            <DragDropContext onDragEnd={result => onDragEnd(result)}>
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
            </DragDropContext>
        </React.Fragment>
    );
}
