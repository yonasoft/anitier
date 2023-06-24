import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar'
import { fetchUserState } from '../utils/internal_apis/auth_api';
import { fetchInventory, fetchTiersFromTierList, fetchTierList } from '../utils/internal_apis/tierlist_apis';
import OwnerTierList from './owner_tier_list';
import UserTierList from './user_tier_list';


export default function TierList({ tierListId }) {

    console.log('tier list id', tierListId);
    const [tierList, setTierList] = useState({
        source: '',
        content_type: '',
    });
    const [userId, setUserId] = useState('');
    const [inventoryContentIds, setInventoryContentIds] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [allContentsAsApi, setAllContentsAsApi] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserState().then(userState => {
            setUserId(userState.user_id);
        }).catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(async data => {
                setTierList(data);
                console.log('tier list data', data);
            }).catch(console.error);
            fetchInventory(tierListId).then(data => {
                console.log('fetched inventory', data)
                if (!data.inventory.content_ids) {
                    setInventoryContentIds([]);
                } else {
                    console.log('inventory data', data);
                    setInventoryContentIds(data.inventory.content_ids);
                }
            });
            fetchTiersFromTierList(tierListId)
                .then(data => {
                    console.log('tiers data', data);
                    setTiers(data);
                })
                .catch(console.error);
        }
    }, [tierListId]);

    useEffect(() => {
        if (tierList) {
            setLoading(false);
        }
    }, [tierList]);

    return (
        <div className='root'>
            {loading ? 'Loading...' :
                userId === tierList.user_id ?
                    <OwnerTierList tierList={tierList} setTierList={setTierList} inventoryContentIds={inventoryContentIds} setInventoryContentIds={setInventoryContentIds} tiers={tiers} setTiers={setTiers} allContentsAsApi={allContentsAsApi} />
                    :
                    <UserTierList tierList={tierList} tiers={tiers} />}
        </div>
    );
}