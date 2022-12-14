import Button from '@restart/ui/esm/Button';
import React from 'react';
import { Modal } from 'react-bootstrap';

export default function DeleteConfessionModal({ deleteConfModal, closeDeletePostModal, deletePost}) {

    //CLOSES THE MODAL
    const closeModal = () => {
        closeDeletePostModal();
    }

    //DELETES THE POST
    const _deletePost = () => {
        deletePost(deleteConfModal.data.postId, deleteConfModal.data.index);
    }

    return (
        <>
            <Modal show={deleteConfModal.visible} onHide={closeModal}>
                <Modal.Header>
                    <h6>Delete Confession</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody">
                    Do you really want to delete the confession ? 
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button className="modalFootBtns btn" variant="primary" onClick={closeModal}>
                        No
                    </Button>
                    <Button className="modalFootBtns btn" variant="primary" onClick={_deletePost}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
