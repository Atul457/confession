import Button from '@restart/ui/esm/Button';
import React from 'react';
import { Modal } from 'react-bootstrap';
import SetAuth from '../../behindScenes/SetAuth';


const VerifyInfoModal = (props) => {

    // Hooks and vars
    const { showLogginBtn } = props

    // Function
    const logout = () => {
        SetAuth(0)
        window.location.href = window.location.origin + "/login"
    }
    return (
        <>
            <Modal show={props.visible} centered size="md">
                <Modal.Header className='justify-content-between'>
                    <h6>Message</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody text-center report_com_modalbody">
                    <>
                        {props.message}
                    </>
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button
                        className="modalFootBtns btn"
                        variant="primary"
                        onClick={props.redirect}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default VerifyInfoModal