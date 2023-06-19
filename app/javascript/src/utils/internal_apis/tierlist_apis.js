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
    return { ...responseData, tiers: responseData.tiers };
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

export async function updateTier(tierId, contentApiIds = []) {
    const contentIds = [];
    for (const id of contentApiIds) {
        const newContent = await createContent(id);
        contentIds.push(newContent.id);
    }

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
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
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

    const responseData = await response.json();
    console.log(`Fetched Inventory: ${JSON.stringify(responseData)}`)
    return responseData;
}


export async function updateInventory(inventoryId, contentApiIds = []) {
    const contentIds = [];
    for (const id of contentApiIds) {
        const newContent = await createContent(id);
        contentIds.push(newContent.id);
    }

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
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function createContent(contentApiId, inventoryIds = [], tierIds = []) {
    // Fetch the content using the contentApiId
    let contentResponse = await fetch(`/api/contents/${contentApiId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (contentResponse.ok) {
        // If the content already exists, update it
        let responseData = await contentResponse.json();
        let existingInventoryIds = responseData.inventory_ids || [];
        let existingTierIds = responseData.tier_ids || [];

        let response = await fetch(`/api/contents/${responseData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                content: {
                    inventory_ids: [...existingInventoryIds, ...inventoryIds],
                    tier_ids: [...existingTierIds, ...tierIds]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error updating content: ${response.statusText}`);
        }

        responseData = await response.json();
        return responseData;
    } else {
        // If the content does not exist, create it
        let response = await fetch('/api/contents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            },
            body: JSON.stringify({
                content: {
                    api_id: contentApiId,
                    inventory_ids: inventoryIds,
                    tier_ids: tierIds
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error creating content: ${response.statusText}`);
        }

        let responseData = await response.json();
        return responseData;
    }
}




