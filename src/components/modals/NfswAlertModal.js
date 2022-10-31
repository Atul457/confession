import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import nfswBanner from "../../images/nfswBanner.svg"
import { forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { toggleNfswModal } from '../../redux/actions/modals/ModalsAc'

const NfswAlertModal = ({ nfsw_modal, ...rest }) => {

    // Hooks and vars
    const dispatch = useDispatch()
    const forum_link = nfsw_modal?.forum_link ?? "#"
    const navigate = useNavigate()

    // Functions

    // Close modal
    const closeModal = (isCancelBtnClick) => {
        dispatch(toggleNfswModal({
            isVisible: false
        }))

        // Works only if user visits using share link ( coz if he will visit from forums page , then he will have to accept the nsfw, the only case remaining to come on detail page is by using shared link, on detail page there is a condition for opening the modal, that checks whether is_nfw is accepted or not, except coming via share link, the nsfw will have to be accepted)
        if (rest?.isForumDetailPage) {
            // If the user cancels/closes the nsfw modal then we redirect him/her back to forums
            if (isCancelBtnClick === true) return navigate("/forums")
            dispatch(forumHandlers.handleForum({
                mutate_data_only: true,
                is_nsw: 0
            }))
        }

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
                    onClick={() => closeModal(true)}
                >
                    Cancel
                </Button>
                {rest?.isForumDetailPage ?
                    <Button
                        className="reqModalFootBtns"
                        variant="primary"
                        onClick={closeModal}
                    >
                        Continue
                    </Button>
                    :
                    <Link to={forum_link}>
                        <Button
                            className="reqModalFootBtns"
                            variant="primary"
                            onClick={() => closeModal(false)}
                        >
                            Continue
                        </Button>
                    </Link>}
            </Modal.Footer>
        </Modal>
    )
}

export default NfswAlertModal