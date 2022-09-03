import React, { useState, useReducer } from 'react';
import userIcon from '../../../images/userAcc.svg';
import mobileProfileIcon from '../../../images/mobileProfileIcon.svg';
import { Link, NavLink } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/Auth/SetAuth';
import { useLocation } from 'react-router';
import Button from '@restart/ui/esm/Button';
import { Modal } from 'react-bootstrap';
import { fetchData } from '../../../commonApi';
import AppLogo from '../../../user/pageElements/components/AppLogo';

// import logo from '../../../images/appLogo.svg';

let initialTypeState = {
    "old": "password",
    "new": "password",
    "confirm": "password",
}

const convertType = (type) => {
    if (type === 'text') {
        return "password";
    } else {
        return "text";
    }
}

const typeReducer = (state = initialTypeState, action) => {
    switch (action.type) {
        case "old": return { ...state, "old": convertType(state.old) }
        case "new": return { ...state, "new": convertType(state.new) }
        case "confirm": return { ...state, "confirm": convertType(state.confirm) }
        default: return initialTypeState;
    }
}

export default function Header(props) {

    const authenticated = useState(auth());
    const [showProfileOption, setShowProfileOption] = useState(false);
    const [type, typeDispatch] = useReducer(typeReducer, initialTypeState);
    let useLocations = useLocation();
    const [reportModal, setReportModal] = useState({
        isVisible: false,
        isLoading: false,
    })
    const [adminDetails] = useState(() => {
        if (auth()) {
            let details = localStorage.getItem("adminDetails");
            details = JSON.parse(details);
            return details;
        } else {
            return '';
        }
    })
    let currentUrl = (useLocations.pathname).replace("/", "");

    const [modalFieldsData, setModalFieldsData] = useState({
        old: '',
        new: '',
        confirm: ''
    })

    const logout = async () => {
        SetAuth(0);
        localStorage.setItem("adminDetails", "");
        localStorage.setItem("adminAuthenticated", "");
        let obj = {
            data: {},
            token: adminDetails.token,
            method: "get",
            url: "admin/logout"
        }
        try {
            const res = await fetchData(obj)
            window.location.href = "/talkplacepanel";
        } catch (err) {
            window.location.href = "/talkplacepanel";
        }
    }

    const handleProfileModal = () => {
        setModalFieldsData({
            old: '',
            new: '',
            confirm: ''
        });
        typeDispatch({ type: "reset" });
        setReportModal({ ...reportModal, isVisible: false });
    }

    const updateProfile = async () => {
        let responseCont = document.querySelector('.responseCont');
        if ((modalFieldsData.new).trim() !== "" && (modalFieldsData.old).trim() !== "" && (modalFieldsData.confirm).trim() !== "") {
            if (modalFieldsData.new === modalFieldsData.confirm) {
                let data = {
                    password: modalFieldsData.new,
                    old_password: modalFieldsData.old
                }
                let obj = {
                    data: data,
                    token: adminDetails.token,
                    method: "post",
                    url: "admin/updatepassword"
                }

                setReportModal({ ...reportModal, isLoading: true });
                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        setReportModal({ isLoading: false, isVisible: false });
                        setModalFieldsData({
                            old: '',
                            new: '',
                            confirm: ''
                        });
                    } else {
                        setReportModal({ ...reportModal, isLoading: false });
                        responseCont.innerHTML = res.data.message;
                    }
                } catch (err) {
                    setReportModal({ ...reportModal, isLoading: false });
                    console.log(err);
                }

            } else {
                responseCont.innerHTML = "New and confirm password doesn't match";
            }
        } else {
            responseCont.innerHTML = "All fields are required";
        }
    }

    const handleModalFieldsData = ({ name, value }) => {
        setModalFieldsData({ ...modalFieldsData, [name]: value });
    }



    return (
        <>
            <header className={`mainHead col-12 posFixedForHeader ${props.fullWidth ? "fullWidthHeader" : ''} ${props.hideRound ? "hideHeaderProfile" : ""}`}>
                <div className="insideHeader">
                    <div className="headerLeftCol pl-0">
                        <span to="/dashboard" className="homeHeaderLink">
                            <AppLogo />
                        </span>
                    </div>
                    <div className="viewProfileIcon pr-md-0 pr-lg-4">
                        <div className="row align-items-center justify-content-end m-0 navigationIcons">
                            {props.links ?

                                <div className={` d-none d-md-block pr-0`}>
                                    <div className={`linksCont container-fluid`}>
                                        <div className="linkBtns">
                                            <NavLink to="/admin/users" className="headerNavLinks">

                                                <i className={`fa fa-user moveABit adminHeaderIcons  ${currentUrl === "admin/users" ? "oColor" : ""}`} aria-hidden="true"></i>
                                                <span
                                                    className={`headLinkName ${currentUrl === "admin/users" ? "activeLinkOfHeader" : ""}`}>Users</span>
                                            </NavLink>
                                        </div>

                                        <div className="linkBtns">
                                            <NavLink to="/admin/reported" className="headerNavLinks">
                                                <i className={`fa fa-flag-o moveABit adminHeaderIcons  ${currentUrl === "admin/reported" ? "oColor" : ""}`} aria-hidden="true"></i>
                                                <span className={`headLinkName ${currentUrl === "admin/reported" ? "activeLinkOfHeader" :
                                                    ""}`}>Reported Users</span>
                                            </NavLink>
                                        </div>

                                        <div className="linkBtns">
                                            <NavLink to="/admin/reportedComments" className="headerNavLinks">
                                                <i className={`fa fa-file moveABit adminHeaderIcons  ${currentUrl === "admin/reportedComments" ? "oColor" : ""}`} aria-hidden="true"></i>
                                                <span className={`headLinkName ${currentUrl === "admin/reportedComments" ? "activeLinkOfHeader" :
                                                    ""}`}>Reported Comments</span>
                                            </NavLink>
                                        </div>

                                        {
                                            authenticated[0] ? <div className="linkBtns">
                                                <NavLink to="/admin/complaints" className="headerNavLinks">
                                                    <i className={`fa fa-align-justify adminHeaderIcons  ${currentUrl === "admin/complaints" ? "oColor" : ""}`} aria-hidden="true"></i>
                                                    <span className={`headLinkName ${currentUrl === "admin/complaints" ? "activeLinkOfHeader" : ""}`}>Complaints</span>
                                                </NavLink>
                                            </div> : ''
                                        }

                                    </div>
                                </div>

                                : ''}

                            {auth() ?
                                (
                                    <div className="authProfileIcon" onClick={() => { showProfileOption ? setShowProfileOption(false) : setShowProfileOption(true) }}>
                                        <span className="requestsIndicatorNuserIconCont" type="button">
                                            <img src={userIcon} alt="" className="userAccIcon headerUserAccIcon" />
                                            <img src={mobileProfileIcon} alt="" className="userAccIcon headerUserAccIcon mobIcon" />
                                        </span>
                                        {showProfileOption && <div className="takeAction wFitContent p-1 pb-0 d-block">

                                            <div type="button" className="profileImgWithEmail takeActionOptions d-flex align-items-center mt-2 textDecNone">
                                                <span className="profileHeaderImage mr-2 ml-2">
                                                    <img src={(adminDetails).profile.image === '' || !(adminDetails).profile.image ? mobileProfileIcon : (adminDetails).profile.image} alt="" />
                                                </span>
                                                <div className="nameEmailWrapperHeader">
                                                    <span className="font-weight-bold">{(adminDetails).profile.first_name}</span>
                                                    <span>{(adminDetails).profile.email}</span>
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                            <div type="button" onClick={() => setReportModal({ ...reportModal, isVisible: true })} className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                                <i className="fa fa-user pl-2" aria-hidden="true"></i>
                                                Change Password
                                            </div>

                                            <hr className="m-0" />
                                            <div type="button" className="takeActionOptions py-2 takeActionOptionsOnHov textDecNone mb-0" onClick={() => logout()}>
                                                <i className="fa fa-power-off pl-2" aria-hidden="true"></i>Logout
                                            </div>
                                        </div>
                                        }
                                    </div>
                                )
                                :
                                <Link to="/admin/login">
                                    <div className="col-md-2 col-12">
                                        <img src={userIcon} alt="" className="userAccIcon headerUserAccIcon" />
                                    </div>
                                </Link>
                            }

                        </div>
                    </div>
                </div>
                <div className={`roundCorners ${props.hideRound ? "d-none" : ""}`}>__</div>
            </header>


            {/* CHANGE PASSWORD MODAL */}
            <Modal show={reportModal.isVisible}>
                <Modal.Header>
                    <h6>Change Password</h6>
                </Modal.Header>

                <Modal.Body className="privacyBody">

                    <form>
                        <span className="eyeNinputCont">
                            <input type={type.old} name="old" value={modalFieldsData.old} onChange={(e) => { handleModalFieldsData(e.target) }} className="form-control mb-2" placeholder="Old password" />
                            <i className={`eyeIcon ${type.old === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`} aria-hidden="true" type="button" onClick={() => typeDispatch({ type: "old" })}></i>
                        </span>

                        <span className="eyeNinputCont">
                            <input type={type.new} name="new" value={modalFieldsData.new} onChange={(e) => { handleModalFieldsData(e.target) }} className="form-control mb-2" placeholder="New password" />
                            <i className={`eyeIcon ${type.new === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`} aria-hidden="true" type="button" onClick={() => typeDispatch({ type: "new" })}></i>
                        </span>

                        <span className="eyeNinputCont">
                            <input type={type.confirm} name="confirm" value={modalFieldsData.confirm} onChange={(e) => { handleModalFieldsData(e.target) }} className="form-control mb-2" placeholder="Confirm password" />
                            <i className={`eyeIcon ${type.confirm === 'text' ? ' fa fa-eye' : ' fa fa-eye-slash'}`} aria-hidden="true" type="button" onClick={() => typeDispatch({ type: "confirm" })}></i>
                        </span>
                    </form>

                    <div className="responseCont text-left text-danger"></div>
                </Modal.Body>

                <Modal.Footer className="pt-0">
                    <Button className="modalFootBtns btn" variant="secondary" onClick={handleProfileModal}>
                        Cancel
                    </Button>

                    <Button className="modalFootBtns btn" variant="primary" onClick={updateProfile}>
                        {reportModal.isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div> : "Save"}
                    </Button>

                </Modal.Footer>
            </Modal>
            {/* CHANGE PASSWORD MODAL */}
        </>
    );
}
