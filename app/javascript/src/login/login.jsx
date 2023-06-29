// home.jsx
import React, { useState } from 'react';
import './login.scss';
import NavBar from '../components/navbar/navbar';
import LoginWidget from './login_widget';
import SignUpWidget from './signup_widget';

export default function Login() {

  const [requireSignup, setRequireSignup] = useState(false);

  return (
    <div id="root">
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div id="welcome-area" className="col-12 col-md-6 px-5 py-5 justify-content-center">
            <h1 className="text-primary">Welcome to AniTier!</h1>
            <h5 className="text-justify mt-4">
              <em>(Not associated with AniList)</em>
            </h5>
            <h6 className="text-justify mt-4">
              Immerse yourself into the boundless universe of Anime, Manga, and Characters! AniTier is your personal stage to create, share, and explore tier lists for all your beloved titles.
            </h6>
            <h6 className="text-justify mt-4">
              No need to manually add titles or images, just search and add the titles OR import directly from a user's AniList or MyAnimeList list!
            </h6>
            <h6 className="text-justify mt-4">
              Sharing is at the heart of AniTier. Share your creative lists with the entire AniTier community. Explore the extensive lists created by others. Get inspired, unravel new titles, or simply see where your favorites rank amongst other fans. The possibilities are endless!
            </h6>
          </div>

          <div id="login-area" className="col-12 col-md-6 bg-white d-flex align-items-center justify-content-center">
            {requireSignup ? <SignUpWidget setRequireSignup={setRequireSignup} /> : <LoginWidget setRequireSignup={setRequireSignup} />}
          </div>
        </div>
      </div>
    </div>
  )
}
