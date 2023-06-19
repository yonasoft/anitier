import React, { useState } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar'
import { fetchUserState } from '../utils/internal_apis/auth_api';
import { fetchInventory, fetchTierList } from '../utils/internal_apis/tierlist_apis';
import OwnerTierList from './owner_tier_list';
import UserTierList from './user_tier_list';


export default function Create({ tierListId }) {
    const [userId, setUserId] = useState('');
    const [inventoryAPIds, setInventoryAPIds] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [tierList, setTierList] = useState({
        source: '',
        content_type: '',
    });

    useEffect(() => {
        fetchUserState().then(userState => {
            setUserId(userState.user_id);
        }).catch(error => console.error(error));

    }, []);

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                setTierList(data);
                setTiers(data.tiers);
                console.log('tiers data', data.tiers);
            }).catch(console.error);

            fetchInventory(tierListId).then(data => {
                if (Array.isArray(data.contents)) {
                    console.log('inventory contents', data.contents);
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


    useEffect(() => {
    }, [inventoryAPIds, tiers]);

    return (
        <div className='root'>
            if(user_id == tierList.user_id){
                <OwnerTierList tierList={tierList} inventoryAPIds={inventoryAPIds} setInventoryAPIds={setInventoryAPIds} tiers={tiers} setTiers={setTiers} />
            } else {
                <UserTierList tierList={tierList} inventoryAPIds={inventoryAPIds} tiers={tiers} />}
        </div>
    );
}