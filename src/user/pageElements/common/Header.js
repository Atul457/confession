import React, { useEffect, useState } from 'react';
import userIcon from '../../../images/userAcc.svg'
import logoutIcon from '../../../images/logoutIcon.svg'
import profileIcon from '../../../images/profileIcon.svg'
import mobileProfileIcon from '../../../images/mobileProfileIcon.svg'
import homeIconActive from '../../../images/homeIcon.svg'
import homeIcon from '../../../images/homeIconActive.svg'
import confessIcon from '../../../images/confessIcon.svg'
import confessIconActive from '../../../images/confessIconActive.svg'
import inboxIcon from '../../../images/inboxIcon.png'
import inboxIconActive from '../../../images/inboxIconActive.png'
import newInactiveMessages from '../../../images/newInMessages.svg'
import newMessagesInbox from '../../../images/newMessages.svg'
import { Link, NavLink } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/SetAuth';
import { useLocation } from 'react-router';
import { fetchData } from '../../../commonApi';
import contactUsActiveIcon from '../../../images/contactUsIconActive.png';
import contactUsIcon from '../../../images/contactUsIcon.png';
import VerifyEmailModal from '../Modals/VerifyEmailModal';
import { useDispatch, useSelector } from 'react-redux';
import AppLogo from "../components/AppLogo";
import { togglemenu } from '../../../redux/actions/share';
import UpdatePasswordModal from '../Modals/UpdatePasswordModal';
import { UpdateUPassActionCreators } from '../../../redux/actions/updateUserPassword';


export default function Header(props) {

    const ShareReducer = useSelector(store => store.ShareReducer);
    const verifyEState = useSelector(store => store.VerifyEmail);
    const dispatch = useDispatch();
    const [profile] = useState(() => {
        if (auth()) {
            let profile = localStorage.getItem("userDetails");
            profile = JSON.parse(profile);
            profile = profile.profile;
            return profile;
        }
    });

    const [token] = useState(() => {
        if (auth()) {
            let profile = localStorage.getItem("userDetails");
            profile = JSON.parse(profile);
            profile = profile.token;
            return profile;
        } else {
            return "";
        }
    });

    const [requestsIndicator, setRequestIndicator] = useState(localStorage.getItem("requestsCount") ? parseInt(localStorage.getItem("requestsCount")) : 0);
    const [newCommentsCount, setNewCommentsCount] = useState(0);
    const [newMssgsCount, setMssgsCount] = useState(0);
    const [showEModal, setShowEModal] = useState(false);
    const authenticated = useState(auth());
    const [showProfileOption, setShowProfileOption] = useState(false);
    let useLocations = useLocation();
    let currentUrl = (useLocations.pathname).replace("/", "");



    useEffect(() => {
        if (showProfileOption) {
            document.addEventListener("click", catchEvent);
        }
        return () => {
            document.removeEventListener("click", catchEvent);
        }
    }, [showProfileOption])


    // GETS THE COUNT OF NEW REQUESTS
    useEffect(() => {
        if (auth()) {
            let obj = {
                data: { page: 1 },
                token: token,
                method: "post",
                url: "getfriendrequests"
            }
            try {
                const res = fetchData(obj)
                res.then((res) => {
                    if (res.data.status === true) {
                        let count = parseInt(res.data.count);
                        setRequestIndicator(count);
                        localStorage.setItem("requestsCount", count);
                    } else {
                        console.log(res.data);
                    }
                })
            } catch {
                console.log("Some error occured");
            }

            getUnreadCommentsCount();
        }
    }, [localStorage.getItem("requestsCount")])


    const catchEvent2 = (e) => {
        var classes = e.target.classList;
        if (!classes.contains("shareReqCont") && !classes.contains("shareReqRows") && !classes.contains("shareKitImgIcon") && !classes.contains("sharekitdots") && !classes.contains("dontHide")) {
            dispatch(togglemenu({
                id: null, value: false
            }))
        }
    }

    useEffect(() => {
        if (ShareReducer.selectedPost?.value) {
            document.addEventListener("click", catchEvent2);
        }
        return () => {
            document.removeEventListener("click", catchEvent2);
        }
    }, [ShareReducer.selectedPost?.value])



    //GETS THE TOTAL NO OF NEW COMMENTS
    const getUnreadCommentsCount = async () => {
        let obj = {
            data: {},
            token: token,
            method: "get",
            url: "newcommentscount"
        }

        try {
            const res = fetchData(obj)
            res.then((res) => {

                if (res.data.status === true) {
                    setNewCommentsCount(res.data.comments);
                    setMssgsCount(res.data.messages)

                    // EMAIL VERIFICATION LOGIC
                    var email_verified = res.data.email_verified;   // 0 NOT VERIFIED , 1 VERIFIED


                    // console.log(verifyEState.verified);
                    if (email_verified !== "" && email_verified === 0) {
                        if (verifyEState.verified === false) {
                            setShowEModal(true);
                        }
                    }

                } else {
                    console.log(res);
                }
            })
        } catch (err) {
            console.log(err);
            console.log("Some error occured");
        }

    }


    // LOGS OUT THE USER
    const logout = async () => {
        SetAuth(0);
        localStorage.removeItem("privacyAccepted");
        localStorage.setItem("userDetails", "");

        let obj = {
            data: {},
            token: token,
            method: "get",
            url: "logout"
        }
        try {
            const res = await fetchData(obj)
            window.location.href = "/login";
        } catch (err) {
            window.location.href = "/login";
        }
    }

    // HANDLE PROFILE DIV
    const catchEvent = (e) => {
        var classes = e.target.classList;
        if (!classes.contains("takeAction") && !classes.contains("userAccIcon")) {
            setShowProfileOption(false);
        }
    }

    const HandleShowHide = () => {
        setShowProfileOption(!showProfileOption)
    }

    const openUpdatePassModal = () => {
        dispatch(UpdateUPassActionCreators.openChangePassModal())
    }
    // END OF HANDLE PROFILE DIV

    return (
        <>
            <header className={`mainHead col-12 posFixedForHeader ${props.fullWidth ? "fullWidthHeader" : ''} ${props.hideRound ? "hideHeaderProfile" : ""}`}>
                {verifyEState && verifyEState.verified === false && <VerifyEmailModal showEModal={showEModal} />}
                <div className="insideHeader">
                    <div className="headerLeftCol pl-0">
                        <span to="/home" className="homeHeaderLink">
                            {/* <img src={logo} alt="" className="appLogo" /> */}
                            <AppLogo />
                        </span>
                    </div>
                    <div className="viewProfileIcon pr-md-0 pr-lg-4">
                        <div className="row align-items-center justify-content-end m-0 navigationIcons">
                            {props.links ?

                                <div className={` d-none d-md-block pr-0`}>
                                    <div className={`linksCont container-fluid`}>
                                        <div className="linkBtns">
                                            <NavLink to="/home" className="headerNavLinks">
                                                <span className="headIconCont">
                                                    <img
                                                        src={currentUrl === 'home' ?
                                                            homeIconActive :
                                                            homeIcon}
                                                        alt="" />
                                                </span>
                                                <span
                                                    className={`headLinkName ${currentUrl === "home" ? "activeLinkOfHeader" : ""}`}>Home</span>
                                            </NavLink>
                                        </div>

                                        <div className="linkBtns">
                                            <NavLink to="/createPost" className="headerNavLinks">
                                                <span className="headIconCont">
                                                    <img src={currentUrl === 'createPost' ? confessIconActive : confessIcon} alt="" />
                                                </span>
                                                <span className={`headLinkName ${currentUrl === "createPost" ? "activeLinkOfHeader" :
                                                    ""}`}>Confess/Share</span>
                                            </NavLink>
                                        </div>

                                        {/* 3x icons are being used */}

                                        {
                                            authenticated[0] ? <div className="linkBtns">
                                                <NavLink to="/chat" className="headerNavLinks">
                                                    <span className="headIconCont">
                                                        <img src={currentUrl === 'chat' ?
                                                            (newMssgsCount > 0 ? newMessagesInbox : inboxIconActive) :
                                                            (newMssgsCount > 0 ? newInactiveMessages : inboxIcon)} alt="" />
                                                    </span>
                                                    <span className={`headLinkName ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Inbox</span>
                                                </NavLink>
                                            </div> :
                                                <div className="linkBtns">
                                                    <Link to="/report" className="headerNavLinks">
                                                        <span className="headIconCont">
                                                            <img className="contactUsIcon" src={currentUrl === 'report' ? contactUsActiveIcon : contactUsIcon} alt="" />
                                                        </span>
                                                        <span className={`headLinkName ${currentUrl === "report" ? "activeLinkOfHeader" : ""}`}>Contact us</span>
                                                    </Link>
                                                </div>
                                        }
                                    </div>
                                </div>

                                : ''}

                            {auth() ?
                                (
                                    <div className="authProfileIcon" onClick={HandleShowHide}>
                                        <span className="requestsIndicatorNuserIconCont" type="button">
                                            <img src={userIcon} alt="" className="userAccIcon headerUserAccIcon" />
                                            <img src={mobileProfileIcon} alt="" className="userAccIcon headerUserAccIcon mobIcon" />
                                            {requestsIndicator > 0 && (
                                                <span className="requestIndicator"></span>
                                            )}
                                        </span>

                                        {showProfileOption && <div className="takeAction p-1 pb-0 d-block">
                                            <Link to="/profile" className="textDecNone border-bottom">
                                                <div type="button" className="profileImgWithEmail takeActionOptions d-flex align-items-center mt-2 textDecNone">
                                                    <span className="profileHeaderImage mr-2 ml-2">
                                                        <img src={profile.image === '' ? mobileProfileIcon : profile.image} alt="" />
                                                    </span>
                                                    <div className="nameEmailWrapperHeader">
                                                        <span className="userDropDown userProfileHeading">{profile.name}</span>
                                                        <span className="userDropDown userProfileSubHeadings">{profile.email}</span>
                                                    </div>
                                                </div>

                                                <hr className="m-0" />
                                                <div type="button" className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                                    <img src={profileIcon} alt="" className='profilePopUpIcons' />
                                                    <span className="viewProfileNcommentsCont">
                                                        <div className='userProfileHeading'>
                                                            View profile
                                                        </div>
                                                        {newCommentsCount > 0 &&
                                                            <div className='userProfileSubHeadings'>
                                                                Unread Replies ({newCommentsCount})
                                                            </div>
                                                        }
                                                    </span>
                                                </div>
                                            </Link>

                                            {profile?.source === 1 &&
                                                <>
                                                    <hr className="m-0" />
                                                    <div type="button"
                                                        onClick={openUpdatePassModal} className="takeActionOptions  userProfileHeading takeActionOptionsOnHov userProfileHeading textDecNone py-2">
                                                        <img src={profileIcon} alt="" className='profilePopUpIcons' />
                                                        Reset Password
                                                    </div>
                                                </>}

                                            <hr className="m-0" />
                                            <div type="button" className="takeActionOptions userProfileHeading py-2 takeActionOptionsOnHov textDecNone mb-0" onClick={() => logout()}>
                                                <img src={logoutIcon} alt="" className='profilePopUpIcons' />Logout
                                            </div>
                                        </div>
                                        }
                                    </div>
                                )
                                :
                                <Link to="/login" className='linkToLogin'>
                                    <div>
                                        <span className="requestsIndicatorNuserIconCont">

                                            <img src={userIcon} alt="" className="userAccIcon headerUserAccIcon" />
                                            <img src={mobileProfileIcon} alt="" className="userAccIcon headerUserAccIcon mobIcon" />

                                        </span>
                                    </div>
                                </Link>
                            }

                        </div>
                    </div>
                </div>
                <div className={`roundCorners ${props.hideRound ? "d-none" : ""}`}>__</div>
            </header>

            <UpdatePasswordModal />
        </>
    );
}
