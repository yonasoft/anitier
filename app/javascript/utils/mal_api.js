import jikanjs from 'jikanjs';
import { ContentType } from '../utils/constants';

const clientID = process.env.MAL_CLIENT_ID;


export async function searchMALContent(contentType, query) {
    switch (contentType) {
        case ContentType.anime:
            return await searchAnime(query);
        case ContentType.manga:
            return await searchManga(query);
        case ContentType.character:
            return await searchCharacters(query);
        default:
            console.error("Invalid content type provided");
            return null;
    }
}

export async function fetchMALContent(contentType, id) {
    switch (contentType) {
        case ContentType.anime:
            return await fetchAnime(id);
        case ContentType.manga:
            return await fetchManga(id);
        case ContentType.character:
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
        const result = await jikanjs.loadAnime(id);
        console.log(result);
        return result;
    } catch (error) {
        console.error(`Error fetching anime data: ${error}`);
    }
}

export async function fetchManga(id) {
    try {
        const result = await jikanjs.loadManga(id);
        console.log(result);
        return result;
    } catch (error) {
        console.error(`Error fetching manga data: ${error}`);
    }
}

export async function fetchCharacter(id) {
    try {
        const result = await jikanjs.loadCharacter(id);
        console.log(result);
        return result;
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

