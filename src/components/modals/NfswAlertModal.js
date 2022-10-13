import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import nfswBanner from "../../images/nfswBanner.svg"
import { toggleNfswModal } from '../../redux/actions/modals/ModalsAc'

const NfswAlertModal = ({ nfsw_modal }) => {

    // Hooks and vars
    const dispatch = useDispatch()
    const forum_link = nfsw_modal?.forum_link

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(toggleNfswModal({
            isVisible: false
        }))
    }

    return (
        <Modal
            show={true}
            onHide={closeModal}
            size="lg"
            className='nsfw_modal'>
            <Modal.Header>
                <h6>NSFW Forum</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody">
                <div className="ImgCont">
                    <div className="head">
                        <img src={nfswBanner} alt="" />
                    </div>
                    <div className="body">
                        NSFW Content
                    </div>
                    <div className='desc'>
                        This Forum Contain Adult Content marked Not Safe For Work.
                        Do you Wish to Proceed?
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 reqModalFooter">
                <Button
                    className="reqModalFootBtns cancel"
                    variant="primary"
                    onClick={closeModal}
                >
                    Cancel
                </Button>
                <Link to={forum_link}>
                    <Button
                        className="reqModalFootBtns"
                        variant="primary"
                        onClick={closeModal}
                    >
                        Continue
                    </Button>
                </Link>
            </Modal.Footer>
        </Modal>
    )
}

export default NfswAlertModal