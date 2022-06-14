import React from 'react';
import Button from '@restart/ui/esm/Button';
import { Modal } from 'react-bootstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import registerLogo from "../../../images/registerLogo.png";
import { Link } from 'react-router-dom';

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
                <Modal.Body className="privacyBody text-left featuresModal">
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        interval={2000}
                        showThumbs={false}
                        showStatus={false}
                        showArrows={false}>
                        <div className="carousel_item_feature">
                            <div>Share interesting posts!</div>
                            <img src={registerLogo} className="carouselImage" />
                        </div>
                        <div className="carousel_item_feature">
                            <div> Make friends and chat anonymously!</div>
                            <img src={registerLogo} className="carouselImage" />
                        </div>
                        <div className="carousel_item_feature">
                            <div> Get email notifications for friend requests and responses to your posts; you'll need to be logged in</div>
                            <img src={registerLogo} className="carouselImage" />
                        </div>
                    </Carousel>
                </Modal.Body>
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button className="modalFootBtns btn" variant="primary" onClick={props.closeModal}>
                        <Link to="/login">Sign in</Link>
                    </Button>
                    <Button className="modalFootBtns btn" variant="primary" onClick={props.closeModal}>
                        <Link to="/register">Sign up</Link>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Features