// api.js
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const fetchUserState = async () => {
    const response = await fetch("/api/authenticate", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (response.status === 401) {
        console.log('User is not logged in.');
    } else if (!response.ok) {
        throw new Error(`Could not fetch user state: ${response.statusText}`);
    }

    return response.json();
};


const logoutUser = async () => {
    const response = await fetch("/api/logout", {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
    }

    return response;
};

async function postTierList(tierList) {
    const { title, description, source, content_type, user_id, upvotes, downvotes } = tierList;

    const response = await fetch('/api/tier_lists', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier_list: {
                title,
                description,
                source,
                content_type,
                user_id,
                upvotes: Number(upvotes),
                downvotes: Number(downvotes),
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
}

async function fetchTierList(id) {
    const response = await fetch(`/api/tier_lists/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching tier list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return { ...responseData, tiers: responseData.tiers };
}

async function updateTierList(id, updatedData) {
    const response = await fetch(`/api/tier_lists/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier_list: {
                ...updatedData
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error updating tier list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

async function postTier(tier, tierListId) {
    const response = await fetch('/api/tiers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier: {
                rank: tier.rank,
                tier_list_id: tierListId
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function postInventory(inventory, tierListId) {
    const response = await fetch('/api/inventories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            inventory: {
                tier_list_id: tierListId,
                contents: inventory.contents
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function fetchInventory(tierListId) {
    const response = await fetch(`/api/tier_lists/${tierListId}/inventories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}


export { postTierList, postTier, postInventory, fetchUserState, updateTierList, fetchTierList, logoutUser, fetchInventory };

