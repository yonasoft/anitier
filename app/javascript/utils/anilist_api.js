import Anilist from 'anilist-node';
const anilist = new Anilist();

const AniListStatus = {
    CURRENT: "CURRENT",
    COMPLETED: "COMPLETED",
    PAUSED: "PAUSED",
    DROPPED: "DROPPED",
    PLANNING: "PLANNING",
    REPEATING: "REPEATING"
}


export async function searchAniListContent(contentType, query) {
    switch (contentType) {
        case 0:
            return await searchAniListAnime(query);
        case 1:
            return await searchAniListManga(query);
        case 2:
            return await searchAniListCharacters(query);
        default:
            console.error("Invalid content type provided");
            return null;
    }
}

export async function fetchAniListContent(contentType, id) {
    switch (contentType) {
        case 0:
            return await fetchAniListAnime(id);
        case 1:
            return await fetchAniListManga(id);
        case 2:
            return await fetchAniListCharacter(id);
        default:
            console.error("Invalid content type provided");
            return null;
    }
}


export async function searchAniListAnime(query) {
    try {
        const result = await anilist.search.anime(query);
        return result;
    } catch (error) {
        console.error(`Error occurred while searching for anime: ${error}`);
        return null;
    }
}

export async function searchAniListManga(query) {
    try {
        const result = await anilist.search.manga(query);
        return result;
    } catch (error) {
        console.error(`Error occurred while searching for manga: ${error}`);
        return null;
    }
}

export async function searchAniListCharacters(query) {
    try {
        const result = await anilist.search.characters(query);
        return result;
    } catch (error) {
        console.error(`Error occurred while searching for characters: ${error}`);
        return null;
    }
}

export async function fetchAniListAnime(id) {
    try {
        const animeData = await anilist.anime(id);
        return animeData;
    } catch (error) {
        console.error(`Error fetching anime data: ${error}`);
    }
}

export async function fetchAniListManga(id) {
    try {
        const mangaData = await anilist.manga(id);
        return mangaData;
    } catch (error) {
        console.error(`Error fetching manga data: ${error}`);
    }
}

export async function fetchAniListCharacter(id) {
    try {
        const characterData = await anilist.character(id);
        return characterData;
    } catch (error) {
        console.error(`Error fetching character data: ${error}`);
    }
}

export async function fetchUserAniListAnimeList(username, status) {
    try {
        const animeListData = await anilist.lists.anime(username, status.toUpperCase());
        return animeListData;
    } catch (error) {
        console.error(`Error fetching user's anime list: ${error}`);
    }
}

export async function fetchUserAniListMangaList(username, status) {
    try {
        const mangaListData = await anilist.lists.manga(username, status.toUpperCase());
        return mangaListData;
    } catch (error) {
        console.error(`Error fetching user's manga list: ${error}`);
    }
}

