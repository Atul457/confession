import heart from '../../../../images/upvoted.svg';
import hurray from '../../../../images/hurray.gif';
import heartHovered from '../../../../images/heartHovered.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShareWithLoveModal, resetShareWithLoveModal } from '../../../../redux/actions/shareWithLoveAc/shareWithLoveAc';
import { Button, Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { useRef, useState } from "react"
import { sharePWLTiles } from '../../../../helpers/sharePWLTiles/sharePWLTiles';
import { getToken as getUserToken } from '../../../../helpers/getToken';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { fetchData } from '../../../../commonApi';
import { apiStatus } from '../../../../helpers/status';
import { getKeyProfileLoc } from '../../../../helpers/profileHelper';
import { useNavigate } from 'react-router-dom';


const ShareWithLoveModal = ({ getConfessions, show = false }) => {

    // Hooks and vars
    const { shareWithLoveReducer } = useSelector(state => state)
    const dispatch = useDispatch()
    const writePostBoxRef = useRef()
    const [activeTile, setActiveTile] = useState(0)
    let maxNoOfChars = 120
    let commentCountReqToPost = 1;
    let isCondStatified = auth() ? getKeyProfileLoc("comments") > commentCountReqToPost : false
    const navigate = useNavigate()

    // Functions
    const closeModal = () => {
        setActiveTile(0)
        dispatch(resetShareWithLoveModal())
    }

    // Click post box
    const clickPostBox = () => {
        if (writePostBoxRef.current) writePostBoxRef.current.focus()
    }

    const postConfession = async () => {

        if (shareWithLoveReducer.status === apiStatus.REJECTED || shareWithLoveReducer.message !== "")
            dispatch(toggleShareWithLoveModal({ status: apiStatus.IDLE, message: "" }))

        let postConfessionArr,
            post_as_anonymous = getKeyProfileLoc("post_as_anonymous", false),
            description = writePostBoxRef?.current?.value,
            selectedCoverLink = sharePWLTiles[activeTile].link


        if (description.trim() !== '') {
            if (description.length > 120)
                return dispatch(toggleShareWithLoveModal({ status: apiStatus.REJECTED, message: "Comment field max length is 120 characters" }))

            if (!auth())
                return dispatch(toggleShareWithLoveModal({ status: apiStatus.REJECTED, message: "Login to share thepost" }))

            postConfessionArr = {
                "description": description.trim(),
                "category_id": "",
                "post_as_anonymous": post_as_anonymous,
                "image": "[]",
                "code": "",
                cover_image: selectedCoverLink
            };

            let obj = {
                data: postConfessionArr,
                token: getUserToken(),
                method: "post",
                url: "createconfession"
            }

            dispatch(toggleShareWithLoveModal({ status: apiStatus.LOADING, message: "" }))

            try {
                const res = await fetchData(obj);
                if (res.data.status === true) {
                    setActiveTile(0)
                    dispatch(toggleShareWithLoveModal({
                        status: apiStatus.FULFILLED,
                        visible: false,
                        message: res.data.message,
                        appreciationModal: { visible: true }
                    }))
                    getConfessions(false, "all", 1)
                } else {
                    console.log(res.data)
                    dispatch(toggleShareWithLoveModal({ status: apiStatus.REJECTED, message: res.data.message }))
                }

            } catch (err) {
                console.log(err);
                dispatch(toggleShareWithLoveModal({ status: apiStatus.REJECTED, message: "Server Error, Please try again after some time..." }))
            }

        }
        else {
            dispatch(toggleShareWithLoveModal({ status: apiStatus.REJECTED, message: "Comment field is required" }))
        }
    }

    const navigateToLogin = () => {
        closeModal()
        navigate("/login")
    }


    return (
        <Modal
            show={shareWithLoveReducer.visible}
            onHide={closeModal}
            className='sharePWLModal'
            centered
            size="lg">
            <Modal.Header className='justify-content-between'>
                <h6>Spread The Love</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="sharePWLConts">
                {(!auth() || !isCondStatified) ? <div className="sharePWLHeading condNotSatisfied">
                    Respond to 2 Posts or Comments to use this feature
                    <i className="fa fa-thumbs-up thumbsUpIcon" aria-hidden="true"></i>
                </div> :
                    <>
                        <div className="sharePWLHeading">
                            Say something positive to inspire or encourage someone else.
                            <br />
                            We rise by lifting others up.<span className='winkEmoji'>&#128521;</span>
                        </div>

                        <div className="sharePWLBgTiles">
                            {sharePWLTiles.map((tile, index) => {
                                return <img
                                    alt={`tile${index}`}
                                    onClick={() => setActiveTile(index)}
                                    className={`tile ${activeTile === index ? "sharePWLActiveTile" : ""}`}
                                    key={tile.src}
                                    src={tile.src} />
                            })}
                        </div>

                        <div
                            className="sharePWLWritePostBox"
                            onClick={clickPostBox}
                            style={{
                                backgroundImage: `url('${sharePWLTiles[activeTile].src}')`
                            }}
                        >
                            <TextareaAutosize
                                maxLength={120}
                                ref={writePostBoxRef}
                                placeholder='Type Your post Here'
                                minRows={1} />
                        </div>
                        <span className="textAreaLimit">[ Max-Characters:{maxNoOfChars} ]</span>
                    </>}

            </Modal.Body>

            <Modal.Footer className="sharePWLMfooter sharePWLConts">
                {auth() ? (
                    isCondStatified && <>
                        {shareWithLoveReducer.message !== "" &&
                            <div className={`responseCont mx-auto ${shareWithLoveReducer.status === apiStatus.REJECTED ? 'text-danger' : 'text-success'}`}>
                                {shareWithLoveReducer.message}
                            </div>}
                        <div className="w-100 d-flex justify-content-end">
                            <Button className="doPostBtn" variant="primary" onClick={postConfession}>
                                {shareWithLoveReducer.status === apiStatus.LOADING ? <div className="spinner-border text-white text-center" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Post"}
                            </Button>
                        </div>
                    </>)
                    :
                    <div div className="w-100 d-flex justify-content-center mt-3">
                        <Button className="modalFootBtns btn mb-2" onClick={navigateToLogin}>
                            Login
                        </Button>
                    </div>}
            </Modal.Footer>
        </Modal >
    )
}


const HeartComponent = () => {
    // Hooks and vars
    const dispatch = useDispatch()

    // Function
    const openSharewithLoveModal = () => {
        dispatch(toggleShareWithLoveModal({
            visible: true
        }))
    }

    return (
        <>
            <span onClick={openSharewithLoveModal} className='sharePWLlabel'>Spread the Love</span>
            <div
                className='heartComp'
                pulsate='28-10-22,pulsatingIcon mobile'
                onClick={openSharewithLoveModal}>
                <img
                    src={heart} alt="heart_image" />
                <img
                    src={heartHovered} alt="heart_hovered_image" />
            </div>
        </>
    )
}


const AppreciationModal = () => {

    const dispatch = useDispatch()
    const { appreciationModal } = useSelector(state => state.shareWithLoveReducer)

    const closeModal = () => {
        dispatch(resetShareWithLoveModal())
    }

    return (
        <Modal
            show={appreciationModal.visible}
            onHide={closeModal}
            centered
            className='sharePWLModal'
            size="md">
            <Modal.Body className="appreciationModalBody">
                <div className="hurrayImage">
                    <img src={hurray} alt={"appreciation img"} />
                </div>
                <div className="wish">
                    Thanks for spreading
                    <br />
                    The Love
                </div>
            </Modal.Body>
            <Modal.Footer className="sharePWLMfooter appreciationModalFoot d-flex justify-content-center">
                <Button className="doPostBtn mt-0" variant="primary" onClick={closeModal}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export { HeartComponent, ShareWithLoveModal, AppreciationModal }