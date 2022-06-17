import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchData } from '../../../commonApi';
import requestModalImg from '../../../images/requestModalImg.png';
import auth from '../../behindScenes/Auth/AuthCheck';

export default function FriendReqModal({ userId, friendReqState, closeFrReqModalFn, toggleLoadingFn, changeRequested, _updateCanBeRequested, cancelReq, changeCancelled }) {

    const sendFriendRequest = async (is_cancelled = 0) => {

        let token;

        if (auth()) {
            token = JSON.parse(localStorage.getItem("userDetails"));
            token = token.token;
        }

        let data = {
            friend_id: userId,
            is_cancelled: is_cancelled,
        }

        toggleLoadingFn();

        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "sendfriendrequest"
        }

        console.log(obj);


        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                is_cancelled === 0 ? changeRequested() : changeCancelled();
            } else {
                console.log(res);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const sendRequest = () => {
        _updateCanBeRequested(2);
    }

    const cancelRequest = () => {
        _updateCanBeRequested(1);
    }

    return (
        <>
            {/* 
                CANCELREQ 
                TRUE : SHOW CANCEL MODAL
                FALSE : SHOW REQUEST MODAL
            */}
            {cancelReq === false
                ?
                <Modal show={friendReqState.visible} onHide={closeFrReqModalFn} size="md">
                    <Modal.Header>
                        <h6>Send a Friend Request</h6>
                        <span onClick={closeFrReqModalFn} type="button">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </Modal.Header>
                    <Modal.Body className="privacyBody friendReqModalBody">
                        <div className="reqModalImgCont">
                            <div className="head">
                                <img src={requestModalImg} alt="" />
                            </div>
                            <div className="body">
                                {friendReqState.requested === true ?
                                    "Friend Request Sent Successfully!" :
                                    "Are you sure you want to send a friend request to this user?"
                                }
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="pt-0 reqModalFooter">
                        {friendReqState.requested === true ?
                            <Button
                                className="reqModalFootBtns w-75"
                                variant="primary"
                                onClick={sendRequest}
                            >
                                Done
                            </Button>
                            :

                            <>
                                <Button
                                    className="reqModalFootBtns cancel"
                                    variant="primary"
                                    onClick={closeFrReqModalFn}
                                >
                                    Cancel
                                </Button>
                                <Button className="reqModalFootBtns" variant="primary" onClick={() => sendFriendRequest()}>
                                    {
                                        friendReqState.loading === true
                                            ?
                                            <div className="spinner-border wColor spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            "Submit"
                                    }
                                </Button></>}
                    </Modal.Footer>
                </Modal>

                :

                <Modal show={friendReqState.visible} onHide={closeFrReqModalFn} size="md">
                    <Modal.Header>
                        <h6>Cancel Request</h6>
                        <span onClick={closeFrReqModalFn} type="button">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </Modal.Header>
                    <Modal.Body className="privacyBody friendReqModalBody">
                        <div className="reqModalImgCont">
                            <div className="head">
                                <img src={requestModalImg} alt="" />
                            </div>
                            <div className="body">
                                {friendReqState.cancelled === true ?
                                    "Request cancelled Successfully!" :
                                    "Are You sure you want to cancel friend request sent, to this User?"}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="pt-0 reqModalFooter">
                        {friendReqState.cancelled === true ?
                            <Button
                                className="reqModalFootBtns w-75"
                                variant="primary"
                                onClick={cancelRequest}
                            >
                                Done
                            </Button>

                            :

                            <>
                                <Button
                                    className="reqModalFootBtns cancel"
                                    variant="primary"
                                    onClick={closeFrReqModalFn}
                                >
                                    No
                                </Button>
                                <Button className="reqModalFootBtns" variant="primary" onClick={() => sendFriendRequest(1)}>
                                    {
                                        friendReqState.loading === true
                                            ?
                                            <div className="spinner-border wColor spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            "Yes"
                                    }
                                </Button></>}
                    </Modal.Footer>
                </Modal>}
        </>
    )
}
