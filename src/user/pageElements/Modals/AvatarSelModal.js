import Button from '@restart/ui/esm/Button';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { avatars } from '../../../helpers/avatars/Avatars';
import tickIcon from "../../../images/tickIcon.svg"
import { resetAvatarModal, toggleAvatarModal } from '../../../redux/actions/avatarSelModalAC';



const AvatarSelModal = ({ uploadImage }) => {

    // Hooks
    const dispatch = useDispatch()
    const avatarModalReducer = useSelector(state => state.avatarModalReducer)
    const [showImages, setShowImages] = useState(false)
    const isNotTypeSelected = avatarModalReducer.type === 1

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(resetAvatarModal())
    }

    // Select avatar
    const selectAvatar = index => {
        dispatch(toggleAvatarModal({
            selected: index
        }))
    }

    // Sets avatar
    const setAvatarToProfile = () => {
        uploadImage(avatars[avatarModalReducer.selected].link)
        closeModal()
    }

    const getAvatar = () => {
        if (avatarModalReducer.selected === null)
            return avatarModalReducer.defaultImg
        let selected = avatarModalReducer.selected
        return avatars[selected].src
    }

    const uploadPicFromGal = () => {
        closeModal()
        let profilePicRef = document.querySelector('#profilePicP');
        profilePicRef.click();
    }

    const revealAvatars = () => {
        dispatch(toggleAvatarModal({
            type: 2
        }))
    }


    return (
        <Modal
            show={avatarModalReducer.visible}
            centered
            className='avatarModal'
            size={`${isNotTypeSelected ? "md" : "lg"}`}
            onHide={closeModal}>

            <Modal.Header className='justify-content-between'>
                <h6>
                    {isNotTypeSelected
                        ? "Select Profile Image" :
                        "Select Avatar"}
                </h6>
                <span type="button" onClick={closeModal}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>

            {isNotTypeSelected ?
                <Modal.Body className="privacyBody text-center profilePicOptions">
                    <Button
                        className="modalFootBtns btn"
                        variant="primary"
                        onClick={uploadPicFromGal}>
                        Upload from gallery
                    </Button>
                    <Button
                        className="modalFootBtns btn"
                        variant="primary"
                        onClick={revealAvatars}>
                        Select Avatar
                    </Button>
                </Modal.Body> :
                <Modal.Body
                    scrollable={"true"}
                    className="privacyBody text-center avatar">
                    <div className="selectedAvatar">
                        <img src={getAvatar()} alt="" />
                    </div>


                    <div className="avtarsCollection row mx-0">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    className={`col-md-3 col-3 cols`}
                                    key={avatar.link}
                                >
                                    <span className='avatarIconCont'>
                                        <img
                                            onLoad={() => {
                                                if (index === avatars.length - 1) {
                                                    setShowImages(true)
                                                }
                                            }}
                                            src={avatar.src}
                                            className={`avatar ${avatarModalReducer.selected === index ? "currSelectedAvatar" : ""} ${showImages ? '' : 'hiddenAvatar'}`}
                                            onClick={() => selectAvatar(index)} />

                                        {avatarModalReducer.selected === index &&
                                            <img src={tickIcon} className={`tickIcon ${!showImages ? "invisible" : ""}`} />}
                                    </span>

                                    <div className={`avatarPlaceholderImages glow ${!showImages ? '' : 'hiddenAvatar'}`}></div>
                                </div>)
                        })}
                    </div>

                </Modal.Body>}

            {!isNotTypeSelected &&
                <Modal.Footer className="pt-0 justify-content-center">
                    <Button
                        className="modalFootBtns btn"
                        variant="primary"
                        onClick={setAvatarToProfile}>
                        Done
                    </Button>
                </Modal.Footer>
            }
        </Modal >
    )
}

export default AvatarSelModal