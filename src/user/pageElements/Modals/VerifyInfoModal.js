import Button from '@restart/ui/esm/Button';
import React from 'react';
import { Modal } from 'react-bootstrap';


const VerifyInfoModal = (props) => {

  return (
        <>
            <Modal show={props.visible} centered size="md">
                <Modal.Header className='justify-content-between'>
                    <h6>Message</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody text-center">
                    <>
                        {props.message}
                    </>
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button className="modalFootBtns btn" variant="primary" onClick={props.redirect}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
  )
}

export default VerifyInfoModal