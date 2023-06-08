import React, { Fragment, useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar';
import { postTier, postTierList, fetchUserState, postInventory, updateTierList } from '../../utils/fetch';

export default function CreateSetup({ nextStep }) {

    const [userId, setUserId] = useState('');
    const [tiers, setTiers] = useState([
        { rank: 'S' },
        { rank: 'A' },
        { rank: 'B' },
        { rank: 'C' },
        { rank: 'D' },
    ]);

    const [tierList, setTierList] = useState({
        title: '',
        description: '',
        source: 0,  // use the string key here
        content_type: 0,  // and here
        user_id: userId,
        upvotes: 0,  // Make sure it's a number
        downvotes: 0,
    });

    const [newTier, setNewTier] = useState('');

    useEffect(() => {
        fetchUserState().then(userState => {
            setUserId(userState.user_id);
            setTierList(prevState => ({ ...prevState, user_id: userState.user_id }));
        }).catch(error => console.error(error));
    }, []);

    const handleInputChange = (event) => {
        setTierList({ ...tierList, [event.target.id]: event.target.value });
    }

    const handleSelectChange = (event) => {
        setTierList({ ...tierList, [event.target.id]: parseInt(event.target.value) });
    }

    const handleNewTierChange = (event) => {
        setNewTier(event.target.value);
    }

    const handleTierChange = (event, index) => {
        const newTiers = [...tiers];
        newTiers[index].rank = event.target.value;
        setTiers(newTiers);
    }

    const removeTier = (index) => {
        const newTiers = [...tiers];
        newTiers.splice(index, 1);
        setTiers(newTiers);
    }

    const addNewTier = () => {
        setTiers([...tiers, { rank: newTier }]);
        setNewTier('');
    }

    const saveTierList = async () => {
        try {
            const tierListResponse = await postTierList(tierList);
            console.log('tierListResponse:', tierListResponse);

            const tierListId = tierListResponse.tier_list.id;  // Extracting the tierListId from the response

            for (const tier of tiers) {
                const tierResponse = await postTier(tier, tierListId);
                console.log(tierResponse);
            }
            const inventoryResponse = await postInventory(tierListId);
            console.log('inventoryResponse:', inventoryResponse);
            const updatedTierList = {
                ...tierList,
                inventory_id: inventoryResponse.id,
            }

            const updatedTierListResponse = await updateTierList(tierListId, updatedTierList);
            console.log(updatedTierListResponse);

            nextStep(tierListId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row align-items-center">
                    <h1 className="col">Create (Setup)</h1>
                    <div className="col-auto d-flex justify-content-end">
                        <a className="btn btn-secondary text-light mb-auto mx-2" href="/">Cancel</a>
                        <button className="btn btn-primary text-light mb-auto ml-2 mx-2" onClick={saveTierList}>Next</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8 ">
                        <div className="form-floating my-3">
                            <input type="text" className="form-control" id="title" onChange={handleInputChange} />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating">
                            <textarea className="form-control" id="description" rows="18" style={{ height: "100%" }} onChange={handleInputChange}></textarea>
                            <label htmlFor="description">Description(optional)</label>
                        </div>
                    </div>
                    <div className="col-4 ">
                        <div >
                            <label htmlFor="source" className="mt-3"><h4>Source</h4></label>
                            <select id="source" className="form-select" defaultValue="0" onChange={handleSelectChange}>
                                <option value={0}>AniList</option>
                                <option value={1}>MyAnimeList</option>
                            </select>

                            <label htmlFor="content_type" className="mt-3"><h4>Type</h4></label>
                            <select id="content_type" className="form-select" defaultValue="0" onChange={handleSelectChange} aria-label="Default select example">
                                <option value="0">Animes</option>
                                <option value="1">Mangas</option>
                                <option value="2">Characters</option>
                            </select>
                        </div>
                        <div className="mt-3">
                            <h4>Tiers</h4>
                            <div id="tiers">
                                {tiers.map((tier, index) => (
                                    <div key={index} className="input-group my-1">
                                        <input type="text" className="form-control" placeholder="Tier Rank" value={tier.rank} onChange={(event) => handleTierChange(event, index)} />
                                        <div className="input-group-append">
                                            <button className="btn btn-danger" type="button" onClick={() => removeTier(index)}>Remove</button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="input-group my-1">
                                <input type="text" className="form-control" placeholder="New Tier" aria-label="New Tier" aria-describedby="basic-addon2" value={newTier} onChange={handleNewTierChange} />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button" onClick={addNewTier}>Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
