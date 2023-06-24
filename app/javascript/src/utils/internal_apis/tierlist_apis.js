const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

export async function postTierList(tierList) {
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

export async function fetchTierList(id) {
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

    return {
        ...responseData,
        inventory: responseData.inventory,
        tiers: responseData.tiers.map(tier => ({
            ...tier,
            contents: tier.contents
        }))
    };
}

export async function updateTierList(id, updatedData) {
    const response = await fetch(`/api/tier_lists/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier_list: {
                ...updatedData,
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error updating tier list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function updateTierListPosted(tierListId, posted) {
    const response = await fetch(`/api/tier_lists/${tierListId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier_list: {
                posted: posted
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function fetchUserTierLists(userId) {
    const response = await fetch(`/api/tier_lists/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching user's tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function fetchPostedUserTierLists(userId) {
    const response = await fetch(`/api/tier_lists/user/${userId}/posted`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching posted tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function fetchUnpostedUserTierLists(userId) {
    const response = await fetch(`/api/tier_lists/user/${userId}/unposted`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching unposted tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}


export async function fetchRecentTierLists() {
    const response = await fetch(`/api/tier_lists/recent`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching recent tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function fetchPopularTierLists() {
    const response = await fetch(`/api/tier_lists/popular`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching popular tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function fetchHotTierLists() {
    const response = await fetch(`/api/tier_lists/hot`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching hot tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function postTier(tier, tierListId, contentIds = []) {
    const response = await fetch('/api/tiers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier: {
                rank: tier.rank,
                tier_list_id: tierListId,
                content_ids: contentIds
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchTiersFromTierList(tierListId) {
    const response = await fetch(`/api/tier_lists/${tierListId}/tiers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching tiers from tier list: ${response.statusText}`);
    }

    const tiers = await response.json();
    console.log(tiers);  // Log the tiers received from the server.

    return tiers.map(tier => {
        console.log(tier);  // Log each tier.
        const { id, rank, content_ids = [] } = tier;
        return { id, rank, content_ids };
    });
}

export async function updateTier(tierId, contentIds = []) {
    const response = await fetch(`/api/tiers/${tierId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            tier: {
                content_ids: contentIds
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error updating tier: ${response.statusText}`);
    }

    const responseData = await response.json();
    responseData.content_ids = responseData.content_ids || [];
    return responseData;
}

export async function fetchInventory(inventoryId) {
    const response = await fetch(`/api/inventories/${inventoryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`);
    }

    let responseData = await response.json();
    responseData = responseData || {};
    responseData.content_ids = responseData.content_ids || [];

    return responseData;
}


export async function updateInventory(inventoryId, contentIds = []) {
    const response = await fetch(`/api/inventories/${inventoryId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            inventory: {
                content_ids: contentIds
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error updating inventory: ${response.statusText}`);
    }

    let responseData = await response.json();

    if (responseData) {
        responseData.content_ids = responseData.content_ids || [];
    } else {
        console.error('Inventory is undefined in the response');
    }

    console.log('Update INV RESPONSE DATA', JSON.stringify(responseData));
    return responseData;
}


export async function fetchContentModel(contentId) {
    const response = await fetch(`/api/contents/${contentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching content: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Data for contentId ${contentId}: `, data);
    return data;
}

export async function createContent(api_id, name, imageUrl) {
    const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({
            content: {
                api_id: api_id,
                name: name,
                image_url: imageUrl,
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('content added', JSON.stringify(responseData));

    return responseData.id;
}









