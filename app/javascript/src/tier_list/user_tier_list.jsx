import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar';
import { postTier, postTierList } from '../utils/internal_apis/tierlist_apis';
import { fetchUserDataById, fetchUserState } from '../utils/internal_apis/auth_api';
import Tier from '../components/tier/tier';
import { ContentType } from '../utils/constants';
import TierNonDroppable from '../components/tier/tier_nondroppable';

export default function UserTierList({ tierList, tiers }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchUserDataById(tierList.user_id)
            .then(userData => setUser(userData))
            .catch(error => console.error(error));
    }, [tierList]);


    return (<React.Fragment>
        <NavBar />
        <div className="container bg-light pa-3">
            <div className="row">
                <div className="col-12">
                    <h1>{tierList.title}</h1>
                    <h4>{`by ${user.username}`}</h4>
                    <p>{tierList.description}</p>
                </div>
                <div className="col-12">
                    <div><a className="btn btn-primary text-light my-2" href="#">Share</a></div>
                    <div id="ranks" className="row">
                        {tiers && tiers.map((tier, index) => (
                            <TierNonDroppable
                                key={index} tier={tier} tierIndex={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}