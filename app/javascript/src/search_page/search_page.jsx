import React, { useState } from 'react';
import './search_page.scss';
import NavBar from '../components/navbar/navbar';
import ActivityTierListColumn from '../components/activity_tierlist_column/activity_tierlist_column';
import { ContentType } from '../utils/constants';
import { fetchSearchResults } from '../utils/internal_apis/tierlist_apis';


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState(ContentType.anime);

  const performSearch = () => {
    if (searchQuery.length > 0) {
      fetchSearchResults(searchQuery, selectedType)
        .then((data) => {
          console.log('search results', data);
          setSearchResults(data)
        })
        .catch(console.error);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <div id="root">
      <NavBar />
      <div className="container">
        <div className="row">
          <div className="col-12 bg-white py-2">
            <h1>Search</h1>
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" onChange={e => setSearchQuery(e.target.value)} />
              <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value={ContentType.anime}>Anime</option>
                <option value={ContentType.manga}>Manga</option>
                <option value={ContentType.character}>Character</option>
              </select>
              <div className="input-group-append">
                <button className="btn btn-primary" type="button" onClick={performSearch}>Search</button>
              </div>
            </div>
            <div id="results" className="row bg-light">
              {searchResults && searchResults.map(result => (
                <ActivityTierListColumn key={result.id} tierListId={result.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
