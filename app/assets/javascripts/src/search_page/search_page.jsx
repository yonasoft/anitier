import React, { useState } from 'react';
import './search_page.scss';
import NavBar from '../components/navbar/navbar';
import ActivityTierListColumn from '../components/activity_tierlist_column/activity_tierlist_column';
import { ContentType } from '../utils/constants';
import { fetchSearchResults } from '../utils/internal_apis/tierlist_apis';


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedType, setSelectedType] = useState(ContentType.all);



  const performSearch = async () => {
    if (searchQuery.length > 0) {
      let data = [];
      if (selectedType === ContentType.all) {
        for (let type in ContentType) {
          if (type !== 'all') {
            const typeData = await fetchSearchResults(searchQuery, ContentType[type]);
            data = data.concat(typeData);
          }
        }
      } else {
        data = await fetchSearchResults(searchQuery, selectedType);
      }
      console.log('search results', data);
      setSearchResults(data);
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
                <option value={ContentType.all}>All</option>
                <option value={ContentType.anime}>Anime</option>
                <option value={ContentType.manga}>Manga</option>
                <option value={ContentType.character}>Character</option>
              </select>
              <div className="input-group-append">
                <button className="btn btn-primary" type="button" onClick={performSearch}>Search</button>
              </div>
            </div>
            <div id="results" className="row bg-light">
              {searchResults &&
                searchResults.length === 0 ?
                (<h3 className="col-12">No results found</h3>)
                :
                (searchResults.map(result => (
                  <ActivityTierListColumn key={result.id} tierListId={result.id} />
                )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
