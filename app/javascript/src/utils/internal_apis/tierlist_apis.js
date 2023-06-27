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


export async function fetchFilteredUserTierLists(userId, postedStatus, contentType) {

    const response = await fetch('/api/tier_lists/filtered_user_lists?user_id=' + userId + '&posted_status=' + postedStatus + '&content_type=' + contentType, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });


    if (!response.ok) {
        throw new Error(`Error fetching filtered user tier lists: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function deleteTierList(id) {
    const response = await fetch(`/api/tier_lists/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error deleting tier list: ${response.statusText}`);
    }
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
        let { id, rank, content_ids } = tier;

        // Ensure content_ids is an array if it is null.
        if (content_ids === undefined) {
            content_ids = [];
        }

        return { id, rank, content_ids };
    });
}


export async function updateTier(tierId, contentIds = []) {
    console.log(`Updating tier ${tierId} with content_ids: ${contentIds}`);

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

    const responseData = await response.json();
    return responseData;
}

// Fetch inventory function
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

// Function to upvote a tier list
export async function upvoteTierList(tierListId) {
    const response = await fetch(`/api/tier_lists/${tierListId}/upvote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        }
    });

    if (!response.ok) {
        throw new Error(`Error upvoting tier list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

// Function to downvote a tier list
export async function downvoteTierList(tierListId) {
    const response = await fetch(`/api/tier_lists/${tierListId}/downvote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        }
    });

    if (!response.ok) {
        throw new Error(`Error downvoting tier list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

// Function to check the vote status of a user for a specific tier list
export async function checkUserVote(tierListId, userId) {
    const response = await fetch(`/api/tier_lists/${tierListId}/vote_status/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching user vote status: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function updateUser(userId, userObject) {
    const { username, email, password, bio, mal_url, anilist_url } = userObject;

    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({ username, email, password, bio, mal_url, anilist_url }),
    });

    if (!response.ok) {
        console.error('Failed to update user');
    }

    const updatedUser = await response.json();
    return updatedUser;
}





