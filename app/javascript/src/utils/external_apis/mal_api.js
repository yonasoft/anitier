import { ContentType } from '../constants';

const BACKEND_API_BASE_URL = 'https://anitier.herokuapp.com//';
const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

const contentTypeMapping = {
    [ContentType.anime]: "anime",
    [ContentType.manga]: "manga",
    [ContentType.character]: "characters",
};

export async function searchMALContent(contentType, query) {
    if (contentType === ContentType.character) {
        const url = `${JIKAN_API_BASE_URL}/characters?q=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.data);
            return data.data;
        } catch (error) {
            console.error(`Error occurred while searching for characters: ${error}`);
            return null;
        }
    } else {
        const contentTypeAsString = contentTypeMapping[contentType];
        if (contentTypeAsString) {
            const url = `${BACKEND_API_BASE_URL}/api/search_mal_content?content_type=${contentTypeAsString}&query=${query}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                return data;
            } catch (error) {
                console.error(`Error occurred while searching for ${contentTypeAsString}: ${error}`);
                return null;
            }
        } else {
            console.error(`Invalid content type: ${contentType}`);
            return null;
        }
    }
}

export async function fetchMALContentById(contentType, id) {
    if (contentType === ContentType.character) {
        const url = `${JIKAN_API_BASE_URL}/characters/${id}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.data);
            return data.data;
        } catch (error) {
            console.error(`Error occurred while fetching character with id ${id}: ${error}`);
            return null;
        }
    } else {
        const contentTypeAsString = contentTypeMapping[contentType];
        if (contentTypeAsString) {
            const url = `${BACKEND_API_BASE_URL}/api/fetch_mal_content?content_type=${contentTypeAsString}&id=${id}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                return data;
            } catch (error) {
                console.error(`Error occurred while fetching ${contentTypeAsString} with id ${id}: ${error}`);
                return null;
            }
        } else {
            console.error(`Invalid content type: ${contentType}`);
            return null;
        }
    }
}

export async function fetchUserAnimeList(username, status) {
    const url = `${BACKEND_API_BASE_URL}/api/fetch_user_anime_list?username=${username}&status=${status}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {  // check if response returned is not ok
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('An error occurred while fetching the data.');
        }
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error(`Error fetching user's anime list: ${error}`);
        return null;
    }
}

export async function fetchUserMangaList(username, status) {
    const url = `${BACKEND_API_BASE_URL}/api/fetch_user_manga_list?username=${username}&status=${status}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {  // check if response returned is not ok
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('An error occurred while fetching the data.');
        }
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error(`Error fetching user's manga list: ${error}`);
        return null;
    }
}
