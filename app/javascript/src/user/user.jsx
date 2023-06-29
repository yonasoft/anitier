import React, { useState, useEffect } from 'react';
import './user.scss';
import { fetchUserDataById, fetchUserState } from '../utils/internal_apis/auth_api';
import UserSelf from './user_self';
import UserOther from './user_other';

export default function User({ userId }) {
    const [currentUserOnPage, setCurrentUserOnPage] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        fetchUserDataById(userId)
            .then(user => {
                setCurrentUserOnPage(user);
                console.log('user data', user);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        let isMounted = true;

        fetchUserState().then(user => {
            if (isMounted) {
                setLoggedInUser(user);
                console.log('logged in user', user);
            }
        }).catch(error => console.error(error));

        return () => {
            isMounted = false;
        }

    }, []);


    return (currentUserOnPage && loggedInUser) ? (
        <div className='root'>
            {currentUserOnPage.id === loggedInUser.user_id ?
                <UserSelf userOnPage={currentUserOnPage} setUserOnPage={setCurrentUserOnPage} /> :
                <UserOther userOnPage={currentUserOnPage} />}
        </div>
    ) : <div>Loading...</div>
}
