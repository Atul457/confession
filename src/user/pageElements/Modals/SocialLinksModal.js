import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import instaSocial from '../../../images/instaSocial.svg'
import TwitterSocial from '../../../images/TwitterSocial.svg'
import tiktokSocial from '../../../images/tiktokSocial.svg'
import fbSocial from '../../../images/fbSocial.svg'
import { Link } from 'react-router-dom';
import openSLinksModalActionCreators from '../../../redux/actions/socialLinksModal';


const SocialLinksModal = (props) => {

    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(openSLinksModalActionCreators.closeModal());
    }

    return (
        <>
            <Modal show={props.visible} onHide={closeModal} centered size="lg">
                <Modal.Header className='justify-content-between'>
                    <h6>Follow us</h6>
                    <span onClick={closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody text-left socialLinksModal">
                    <ul>
                        <li>
                            <Link to='#'>
                                <img src={fbSocial} alt="fbSocialIcon" />
                            </Link>
                        </li>
                        <li>
                            <Link to='#'>
                                <img src={TwitterSocial} alt="TwitterSocialIcon" />
                            </Link>
                        </li>
                        <li>
                            <Link to='#'>
                                <img src={instaSocial} alt="instaSocialIcon" />
                            </Link>
                        </li>
                        <li>
                            <Link to='#'>
                                <img src={tiktokSocial} alt="tiktokSocialIcon" />
                            </Link>
                        </li>
                    </ul>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default SocialLinksModal;