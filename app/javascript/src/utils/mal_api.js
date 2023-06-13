import { ContentType } from '../utils/constants';

const BACKEND_API_BASE_URL = 'http://localhost:3000';
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


export async function fetchUserAnimeList(username, status) {
    const url = `${BACKEND_API_BASE_URL}/api/fetch_user_anime_list?username=${username}&status=${status}`;
    try {
        const response = await fetch(url);
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
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error(`Error fetching user's manga list: ${error}`);
        return null;
    }
}
