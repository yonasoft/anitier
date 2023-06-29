import React, { useState, useEffect } from 'react';
import './tier_list.scss';
import NavBar from '../components/navbar/navbar';
import { postTier, postTierList } from '../utils/internal_apis/tierlist_apis';
import { fetchUserDataById, fetchUserState } from '../utils/internal_apis/auth_api';
import Tier from '../components/tier/tier';
import { ContentType } from '../utils/constants';
import TierNonDroppable from '../components/tier/tier_nondroppable';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Modal, Button } from 'react-bootstrap';


export default function UserTierList({ tierList, tiers }) {
    const [user, setUser] = useState({});
    const [showShareModal, setShowShareModal] = useState(false);

    const handleOpenShareModal = () => setShowShareModal(true);
    const handleCloseShareModal = () => setShowShareModal(false);


    useEffect(() => {
        fetchUserDataById(tierList.user_id)
            .then(userData => {
                setUser(userData)
                console.log('user data', userData);
            })
            .catch(error => console.error(error));
    }, [tierList]);



    return (

        <React.Fragment>
            <NavBar />
            {tierList.posted ?
                <div className="container bg-light pa-3">
                    <div className="row">
                        <div className="col-12">
                            <h1>{tierList.title}</h1>
                            <h5>by <a href={`/user/${user.id}`}>{user.username}</a></h5>
                            <p>{tierList.description}</p>
                        </div>
                        <div className="col-12">
                            <div><button className="mx-2 my-2 btn btn-primary" onClick={handleOpenShareModal}>Share</button></div>
                            <div id="ranks" className="row">
                                {tiers && tiers.map((tier, index) => (
                                    <TierNonDroppable
                                        key={index} tier={tier} tierIndex={index} source={tierList.source} contentType={ContentType[tierList.content_type]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {showShareModal && (
                        <Modal show={showShareModal} onHide={handleCloseShareModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Share this Tier List</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Copy the link below to share your Tier List:</p>
                                <input type="text" readOnly value={`${window.location.origin}/tierlist/${tierList.id}`} />
                                <CopyToClipboard text={`${window.location.origin}/tierlist/${tierList.id}`}>
                                    <Button variant="secondary">Copy to Clipboard</Button>
                                </CopyToClipboard>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleCloseShareModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                </div>
                : <h2>User has not posted this Tier List yet(It has not been made public)</h2>
            }
        </React.Fragment>)
}