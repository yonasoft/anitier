import React, { } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar';
import { postTier, postTierList } from '../utils/internal_apis/tierlist_apis';
import { fetchUserState } from '../utils/internal_apis/auth_api';
import Tier from '../components/tier/tier';
import { ContentType } from '../utils/constants';
import TierNonDroppable from '../components/tier/tier_nondroppable';

export default function UserTierList({ tierList, tiers }) {

    return (<React.Fragment>
        <NavBar />
        <div className="container-fluid bg-light pa-3">
            <div className="row">
                <div className='d-flex justify-content-between flex-column-reverse flex-md-row'>
                    <h1 className="my-2">Create(Build)</h1>
                    <div>
                        <a className="mx-2 my-2 btn btn-secondary" href="/" title='Finish looking at tier list'>Done</a>
                    </div>
                </div>
                <div className="col-12">
                    <h3>{tierList.title}</h3>
                    <p>{tierList.description}</p>
                </div>
                <div className="col-12">
                    <div><a className="btn btn-primary text-light my-2" href="#">Share</a></div>
                    <div id="ranks" className="row">
                        {tiers && tiers.length > 0 && tiers.map((tier, index) => (
                            <TierNonDroppable
                                key={tier.id} tier={tier} tierIndex={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}