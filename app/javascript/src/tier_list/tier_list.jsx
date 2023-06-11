import React, { useState, useEffect } from 'react';
import EditTierList from './edit_tier_list';
import UserTierList from './user_tier_list';

export default function TierList({ tierListId, currentUserId }) {
    const [tierList, setTierList] = useState(null);

    useEffect(() => {
        if (tierListId) {
            fetchTierList(tierListId).then(data => {
                setTierList(data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [tierListId]);

    if (!tierList) {
        return 'Loading...';
    }

    // Check if the current user is the owner of the tier list
    if (tierList.user.id === currentUserId) {
        return <EditTierList tierListId={tierListId} />;
    } else {
        return <UserTierList tierListId={tierListId} />;
    }
}
