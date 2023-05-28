import React, { useState } from 'react';
import './create.scss';
import NavBar from '../navbar/navbar'
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';

export default function CreateBuild({ nextStep, previousStep }) {

    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <React.Fragment>
            <NavBar />
            <div className="container bg-light pa-3">
                <div className="row">
                    <div className='d-flex justify-content-between'>
                        <h3 className="my-2 ">
                            Inventory
                        </h3>
                        <div>
                            <Button className="mx-2 my-2 btn-secondary" onClick={previousStep}>Back</Button>
                            <Button className="mx-2 my-2">Save</Button>
                            <a className="mx-2 my-2 btn btn-secondary" href="/">Finish</a>
                        </div>

                    </div>
                    <div className="col-8 ">
                        <a className="btn btn-primary text-light my-2" href="#">Share</a>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="title" />
                            <label htmlFor="title">Title</label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea className="form-control" id="description" rows="2" style={{ height: "100%" }}></textarea>
                            <label htmlFor="description">Description(optional)</label>
                        </div>
                        <div>
                            <h3 className="my-2">
                                Ranks
                            </h3>
                        </div>
                    </div>
                    <div className="col-4 ">
                        <div className='d-flex justify-content-between'>
                            <h3 className="my-2 ">
                                Inventory
                            </h3>
                            <Button className="my-2" onClick={handleOpenModal}>Add</Button>
                        </div>
                        <div id="inventory" className="row bg-light w-100">
                        </div>
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Items</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Tabs defaultActiveKey="tab1" id="uncontrolled-tab-example">
                                    <Tab eventKey="tab1" title="Search">
                                        {/* content for Tab 1 */}
                                    </Tab>
                                    <Tab eventKey="tab2" title="Import">
                                        {/* content for Tab 2 */}
                                    </Tab>
                                </Tabs>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
