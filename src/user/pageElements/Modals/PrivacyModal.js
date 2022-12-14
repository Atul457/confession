import Button from '@restart/ui/esm/Button';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function PrivacyModal(props) {

  const acceptPrivacy = () => {
    props.acceptPrivacy();
    props.openFeatures();
  }

  return (
    <>
      <Modal show={props.privacyModal.visible} centered size="md">
        <Modal.Header className='justify-content-between'>
          <h6>Privacy Policy</h6>
        </Modal.Header>
        <Modal.Body className="privacyBody text-left">
          <>
            Javon Technology Limited operates the TheTalkPlace.com website,
            Please follow the link to read the site:
            <ul>
              <li>
                <Link to="/terms" target="blank" className='viewMoreBtn'>Terms and Conditions</Link></li>
              <li>
                <Link target="blank" className='viewMoreBtn' to="/privacy">Privacy Policy</Link></li>
              <li>
                <Link target="blank" className='viewMoreBtn' to="/cookie">Use of Cookies </Link></li>
            </ul>

            <div>
              By clicking Agree, you confirm you have read and agreed to the policies and terms of usage.
            </div>
          </>
        </Modal.Body>
        <Modal.Footer className="pt-0 justify-content-center">
          <Button className="modalFootBtns btn" variant="primary" onClick={acceptPrivacy}>
            Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
