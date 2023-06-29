import React, { useState, useEffect } from 'react';
import './activity.scss';
import NavBar from '../components/navbar/navbar';
import { fetchMostRecentTierLists, fetchTopTierLists } from '../utils/internal_apis/tierlist_apis';
import ActivityTierListColumn from '../components/activity_tierlist_column/activity_tierlist_column';



export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [selectedOption, setSelectedOption] = useState('recent');

  async function fetchActivities() {
    if (selectedOption === 'recent') {
      const data = await fetchMostRecentTierLists();
      console.log('activity: most recet tier list', data);
      setActivities(data);
    } else if (selectedOption === 'top') {
      const data = await fetchTopTierLists();
      console.log('activity: top tier list', data);
      setActivities(data);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [selectedOption]);

  return (
    <div id="root">
      <NavBar />
      <div className="container ">
        <div className="row ">
          <div className="col-12 py-2">
            <div className="d-flex">
              <h1 className="me-auto">Activity</h1>
              <div className="btn-group ms-auto">
                <select defaultValue="recent" className="form-select form-select-lg" aria-label=" example" onChange={e => setSelectedOption(e.target.value)}>
                  <option value="recent">Recent</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-12 bg-light">
            <div id="activities" className="row">
              {activities && activities.map(activity => (
                <ActivityTierListColumn key={activity.id} tierListId={activity.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
