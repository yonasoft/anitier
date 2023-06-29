import React, { Fragment, useState, useEffect } from 'react';
import './create.scss';
import NavBar from '../components/navbar/navbar';
import { postTier, postTierList } from '../utils/internal_apis/tierlist_apis';
import { fetchUserState } from '../utils/internal_apis/auth_api';

export default function CreateSetup({ nextStep }) {

    const [userState, setUserState] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [newTier, setNewTier] = useState('');
    const [tiers, setTiers] = useState([
        { rank: 'S', content_ids: [] },
        { rank: 'A', content_ids: [] },
        { rank: 'B', content_ids: [] },
        { rank: 'C', content_ids: [] },
        { rank: 'D', content_ids: [] },
    ]);
    const [showError, setShowError] = useState(false);
    const [showTitleAlert, setShowTitleAlert] = useState(false);
    const [showTiersAlert, setShowTiersAlert] = useState(false);


    const [tierList, setTierList] = useState({
        title: '',
        description: '',
        source: 0,  // use the string key here
        content_type: 0,  // and here
        user_id: userState.user_id,
        upvotes: 0,
        downvotes: 0,
    });


    useEffect(() => {
        fetchUserState().then(userState => {
            setUserState(userState);
            setLoggedIn(userState.logged_in)
            setTierList(prevState => ({ ...prevState, user_id: userState.user_id }));
        }).catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (loggedIn) {
            setShowError(false);
        } else {
            setShowError(true);
        }
    }, [loggedIn])

    const handleInputChange = (event) => { setTierList({ ...tierList, [event.target.id]: event.target.value }); }
    const handleSelectChange = (event) => { setTierList({ ...tierList, [event.target.id]: parseInt(event.target.value) }); }
    const handleNewTierChange = (event) => { setNewTier(event.target.value); }
    const handleTierChange = (event, index) => { const newTiers = [...tiers]; newTiers[index].rank = event.target.value; setTiers(newTiers); }

    const removeTier = (index) => {
        const newTiers = [...tiers];
        newTiers.splice(index, 1);
        setTiers(newTiers);
    }

    const addNewTier = () => {
        setTiers([...tiers, { rank: newTier.toUpperCase(), content_ids: [] }]);
        setNewTier('');
    }

    const saveTierList = async () => {
        setShowTitleAlert(false);
        setShowTiersAlert(false);

        if (!tierList.title) {
            setShowTitleAlert(true);
            return;
        }

        if (tiers.length < 2) {
            setShowTiersAlert(true);
            return;
        }

        try {
            const tierListResponse = await postTierList(tierList);
            console.log('tierListResponse:', tierListResponse);

            const tierListId = tierListResponse.tier_list.id;  // Extracting the tierListId from the response

            for (const tier of tiers) {
                const tierResponse = await postTier(tier, tierListId);
                console.log(tierResponse);
            }

            nextStep(tierListId);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-white pa-3">
                <div className="row align-items-center">
                    <h1 className="col">Create (Setup)</h1>

                    <div className="col-auto d-flex justify-content-end">
                        <a className="btn btn-secondary text-light mb-auto mx-2" href="/">Cancel</a>
                        <button className="btn btn-primary text-light mb-auto ml-2 mx-2" disabled={!loggedIn} onClick={saveTierList}>Next</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8 ">
                        {showError &&
                            <div className="alert alert-danger" role="alert">
                                Must be logged in to create tier list!
                            </div>
                        }
                        {showTitleAlert &&
                            <div className="alert alert-danger" role="alert">
                                Please fill out the title before proceeding.
                            </div>
                        }
                        {showTiersAlert &&
                            <div className="alert alert-danger" role="alert">
                                Please add at least two tiers before proceeding.
                            </div>
                        }
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