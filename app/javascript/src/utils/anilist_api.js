import { ContentType } from './constants';
const fetch = require('node-fetch');

export async function searchAniListContent(contentType, query) {
  switch (contentType) {
    case ContentType.anime:
      return await searchAnilistAnime(query);
    case ContentType.manga:
      return await searchAnilistManga(query);
    case ContentType.character:
      return await searchAnilistCharacter(query);
    default:
      console.error("Invalid content type provided");
      return null;
  }
}

export async function fetchAniListContent(contentType, id) {
  switch (contentType) {
    case ContentType.anime:
      return await fetchAniListAnime(id);
    case ContentType.manga:
      return await fetchAniListManga(id);
    case ContentType.character:
      return await fetchAniListCharacter(id);
    default:
      console.error("Invalid content type provided");
      return null;
  }
}

async function searchAnilistAnime(query, page = 1, perPage = 50) {
  const graphqlQuery = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          siteUrl
        }
      }
    }
  `;

  const variables = {
    search: query,
    page: page,
    perPage: perPage,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Page.media;
}


async function searchAnilistManga(query, page = 1, perPage = 50) {
  const graphqlQuery = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(search: $search, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          siteUrl
        }
      }
    }
  `;

  const variables = {
    search: query,
    page: page,
    perPage: perPage,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Page.media;
}

async function searchAnilistCharacter(query, page = 1, perPage = 50) {
  const graphqlQuery = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        characters(search: $search) {
          id
          name {
            first
            last
          }
          image {
            large
          }
          siteUrl
        }
      }
    }
  `;

  const variables = {
    search: query,
    page: page,
    perPage: perPage,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Page.characters;
}


export async function fetchAniListAnime(id) {
  const graphqlQuery = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        siteUrl
      }
    }
    `;

  const variables = {
    id: id,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Media;
}

// You can use the same structure to update fetchAniListManga and fetchAniListCharacter


export async function fetchAniListManga(id) {
  const graphqlQuery = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
        }
        siteUrl
      }
    }
    `;

  const variables = {
    id: id,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Media;
}

export async function fetchAniListCharacter(id) {
  const graphqlQuery = `
    query ($id: Int) {
      Character(id: $id) {
        id
        name {
          first
          last
          native
        }
        image {
          large
        }
        siteUrl
      }
    }
    `;

  const variables = {
    id: id,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.Character;
}

export async function fetchUserAniListAnimeList(username, status) {
  const graphqlQuery = `
    query ($userName: String, $status: MediaListStatus) {
      MediaListCollection(userName: $userName, type: ANIME, status: $status) {
        lists {
          name
          entries {
            media {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              siteUrl
            }
          }
        }
      }
    }
    `;

  const variables = {
    userName: username,
    status: status,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.MediaListCollection.lists;
}

export async function fetchUserAniListMangaList(username, status) {
  const graphqlQuery = `
    query ($userName: String, $status: MediaListStatus) {
      MediaListCollection(userName: $userName, type: MANGA, status: $status) {
        lists {
          name
          entries {
            media {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
              siteUrl
            }
          }
        }
      }
    }
    `;

  const variables = {
    userName: username,
    status: status,
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: variables,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data.data.MediaListCollection.lists;
}




