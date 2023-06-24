import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar'
import { fetchUserState } from '../utils/internal_apis/auth_api';
import { fetchInventory, fetchTierList } from '../utils/internal_apis/tierlist_apis';
import OwnerTierList from './owner_tier_list';
import UserTierList from './user_tier_list';


export default function TierList({ tierListId }) {
    console.log('tier list id', tierListId);
    const [userId, setUserId] = useState('');
    const [inventoryAPIds, setInventoryAPIds] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [tierList, setTierList] = useState({
        source: '',
        content_type: '',
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchUserState().then(userState => {
            setUserId(userState.user_id);
        }).catch(error => console.error(error));

    }, []);

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                console.log('tier list data', data);
                setTierList(data);
                setTiers(data.tiers);
                console.log('tiers data', data.tiers);
            }).catch(console.error);

            fetchInventory(tierListId).then(data => {
                if (Array.isArray(data.contents)) {
                    console.log('inventory contents', data.contents);
                    setInventoryAPIds(data.contents.map(content => content.api_id));
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

    useEffect(() => {
        if (tierList && tierList.id && userId && tiers && inventoryAPIds) {
            setLoading(false);
        }
    }, [userId, tierList, inventoryAPIds, tiers]);

    return (
        <div className='root'>
            {loading ? 'Loading...' :
                userId === tierList.user_id ?
                    <OwnerTierList tierList={tierList} setTierList={setTierList} inventoryAPIds={inventoryAPIds} setInventoryAPIds={setInventoryAPIds} tiers={tiers} setTiers={setTiers} />
                    :
                    <UserTierList tierList={tierList} tiers={tiers} />}
        </div>
    );
}