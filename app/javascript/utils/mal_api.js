import jikanjs from 'jikanjs';

const clientID = process.env.MAL_CLIENT_ID;

const ContentType = {
    0: 'anime',
    1: 'manga',
    2: 'character',
};


const AnimeStatus = {
    0: "watching",
    1: "completed",
    2: "on_hold",
    3: "dropped",
    4: "plan_to_watch"
}

const MangaStatus = {
    0: "reading",
    1: "completed",
    2: "on_hold",
    3: "dropped",
    4: "plan_to_read"
}

export async function searchMALContent(contentType, query) {
    switch (contentType) {
        case 0:
            return await searchAnime(query);
        case 1:
            return await searchManga(query);
        case 2:
            return await searchCharacters(query);
        default:
            console.error("Invalid content type provided");
            return null;
    }
}

export async function fetchMALContent(contentType, id) {
    switch (contentType) {
        case 0:
            return await fetchAnime(id);
        case 1:
            return await fetchManga(id);
        case 2:
            return await fetchCharacter(id);
        default:
            console.error("Invalid content type provided");
            return null;
    }
}

export async function searchAnime(query) {
    try {
        const result = await jikanjs.search('anime', query);
        return result.results;
    } catch (error) {
        console.error(`Error occurred while searching for anime: ${error}`);
        return null;
    }
}

export async function searchManga(query) {
    try {
        const result = await jikanjs.search('manga', query);
        return result.results;
    } catch (error) {
        console.error(`Error occurred while searching for manga: ${error}`);
        return null;
    }
}

export async function searchCharacters(query) {
    try {
        const result = await jikanjs.search('character', query);
        return result.results;
    } catch (error) {
        console.error(`Error occurred while searching for characters: ${error}`);
        return null;
    }
}


export async function fetchAnime(id) {
    try {
        const animeData = await jikanjs.loadAnime(id);
        return animeData;
    } catch (error) {
        console.error(`Error fetching anime data: ${error}`);
    }
}

export async function fetchManga(id) {
    try {
        const mangaData = await jikanjs.loadManga(id);
        return mangaData;
    } catch (error) {
        console.error(`Error fetching manga data: ${error}`);
    }
}

export async function fetchCharacter(id) {
    try {
        const characterData = await jikanjs.loadCharacter(id);
        return characterData;
    } catch (error) {
        console.error(`Error fetching character data: ${error}`);
    }
}

export async function fetchUserAnimeList(username, status) {
    const response = await fetch(`https://api.myanimelist.net/v2/users/${username}/animelist?status=${AnimeStatus[status]}`, {
        headers: {
            'X-MAL-CLIENT-ID': clientID 
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching user's anime list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

export async function fetchUserMangaList(username, status) {
    const response = await fetch(`https://api.myanimelist.net/v2/users/${username}/mangalist?status=${MangaStatus[status]}`, {
        headers: {
            'X-MAL-CLIENT-ID': clientID 
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching user's manga list: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
}

