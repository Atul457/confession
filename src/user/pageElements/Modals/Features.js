import React from 'react';
import Button from '@restart/ui/esm/Button';
import { Modal } from 'react-bootstrap';

const Features = (props) => {
    return (
        <>
            <Modal show={props.visible} onHide={props.closeModal} centered size="md">
                <Modal.Header className='justify-content-between'>
                    <h6>New Features</h6>
                    <span onClick={props.closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody text-left">
                    <ul>
                        <li>
                            Share interesting posts!
                        </li>
                        <li>
                            Make friends and chat anonymously!
                        </li>
                        <li>
                            Get email notifications for friend requests and responses to your posts; you'll need to be logged in
                        </li>
                    </ul>
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button className="modalFootBtns btn" variant="primary" onClick={props.closeModal}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Features