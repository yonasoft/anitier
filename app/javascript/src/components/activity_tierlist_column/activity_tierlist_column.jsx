import React, { useState, useEffect } from 'react';
import { downvoteTierList, fetchContentModel, fetchTierList, fetchTiersFromTierList, fetchUserVoteStatus, upvoteTierList } from '../../utils/internal_apis/tierlist_apis';
import { fetchUserDataById, fetchUserState } from '../../utils/internal_apis/auth_api';
import './activity_tierlist_column.scss';

export default function ActivityTierListColumn({ tierListId }) {

    const [tierList, setTierList] = useState({});
    const [tiers, setTiers] = useState([]);
    const [tierListOwner, setTierListOwner] = useState({});//[tierListOwner,setTierListOwner]    
    const [user, setUser] = useState(null);
    const [contentImages, setContentImages] = useState([]);
    const [userVote, setUserVote] = useState(null);
    const [votes, setVotes] = useState(0);

    const fetchTiers = async () => {
        try {
            const data = await fetchTiersFromTierList(tierListId);
            console.log('tiers data in conte', data);
            setTiers(data);
            return data; // return the tiers data
        } catch (error) {
            console.error(error);
        }
    }

    const fetchImages = async (tiers) => { // accept tiers as argument
        let contentIds = tiers.flatMap(tier => tier.content_ids); // flatten content IDs
        try {
            let images = await Promise.all(contentIds.map(async id => {
                const content = await fetchContentModel(id);
                return content.image_url;
            }));
            console.log('images', images);
            setContentImages(images);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTierListData = async () => {
        try {
            const data = await fetchTierList(tierListId);
            setTierList(data);
            setVotes(data.upvotes - data.downvotes);
        } catch (error) {
            console.error(error);
        }
    }



    useEffect(() => {
        fetchTiersFromTierList(tierListId).then((data) => {
            fetchImages(data);
        });

        if (tierList.upvotes !== undefined && tierList.downvotes !== undefined) {
            setVotes(tierList.upvotes - tierList.downvotes);
        }
    }, [tierList.id, tierList.upvotes, tierList.downvotes]);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await fetchUserState();
            setUser(userData);
        }

        fetchUser();
        fetchTierListData();
    }, []);

    useEffect(() => {
        fetchTiers().then((data) => {
            fetchImages(data);
        });

        if (tierList.upvotes !== undefined && tierList.downvotes !== undefined) {
            setVotes(tierList.upvotes - tierList.downvotes);
        }
    }, [tierList]);

    useEffect(() => {
        const fetchVoteStatus = async () => {
            if (user && user.user_id) {
                const voteStatus = await fetchUserVoteStatus(tierListId, user.user_id);
                if (voteStatus.upvoted) {
                    setUserVote('up');
                } else if (voteStatus.downvoted) {
                    setUserVote('down');
                } else {
                    setUserVote(null);
                }
            }
        };

        fetchVoteStatus();
    }, [tierList, user]);

    useEffect(() => {
        fetchUserDataById(tierList.user_id)
            .then(userData => {
                setTierListOwner(userData)
                console.log('user data', userData);
            })
            .catch(error => console.error(error));
    }, [tierList]);


    const handleUpvote = async () => {
        try {
            await upvoteTierList(tierListId, user.user_id);
            setUserVote('up');
            fetchTierListData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownvote = async () => {
        try {
            await downvoteTierList(tierListId, user.user_id);
            setUserVote('down');
            fetchTierListData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleTierListClick = () => {
        window.location.href = `/tierlist/${tierListId}`;
    };

    return (
        <div className="column card col-12 mx-2 my-1 bg-white" >
            <div className="row align-items-center">

                {user && user.logged_in && (
                    <div className="vote-section col-1">
                        <button onClick={handleUpvote}>
                            <i className={`button-arrow up ${userVote === 'up' ? 'highlight' : ''}`}></i>
                        </button>
                        {votes}
                        <button onClick={handleDownvote}>
                            <i className={`button-arrow down ${userVote === 'down' ? 'highlight' : ''}`}></i>
                        </button>

                    </div>
                )}

                <div className={(user && user.logged_in) ? 'col-11' : 'col-12'} onClick={handleTierListClick}>
                    <h5 className='card-title'>{tierList.title}</h5>
                    <p>by <a href={`/user/${tierListOwner.id}`}>{tierListOwner.username}</a></p>
                    <p style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{tierList.description}</p>
                    <div className="images-row row"> {contentImages.map((image, index) => {
                        return (
                            <div className='col-2 col-lg-1 p-0 img-container' key={index}>
                                <img className='image' src={image} alt="content image" />
                            </div>
                        )
                    })}</div>
                </div>
            </div>
        </div>
    );
};
