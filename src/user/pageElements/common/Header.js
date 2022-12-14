import React, { useContext, useEffect, useRef, useState } from 'react';
import userIcon from '../../../images/userAcc.svg'
import logoutIcon from '../../../images/logoutIcon.svg'
import searchIcon from '../../../images/searchIcon.svg'
import searchIconActive from '../../../images/searchIconActive.svg'
import follow_usIcon from '../../../images/follow_usIcon.svg'
import friendRequests from '../../../images/friendRequests.svg'
import profileResetPass from '../../../images/profileResetPass.svg'
import verifiedIcon from '../../../images/verifiedIcon.svg'
import profileIcon from '../../../images/profileIcon.svg'
import mobileProfileIcon from '../../../images/mobileProfileIcon.svg'
import homeIconActive from '../../../images/homeIcon.svg'
import homeIcon from '../../../images/homeIconActive.svg'
import bell from '../../../images/bell.svg'
import confessIcon from '../../../images/confessIcon.svg'
import confessIconActive from '../../../images/confessIconActive.svg'
import bellActive from '../../../images/orangebell.svg'
import inboxIcon from '../../../images/inboxIcon.svg'
import inboxIconActive from '../../../images/inboxIconActive.svg'
import { Link, NavLink, useParams } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/SetAuth';
import { useLocation } from 'react-router';
import { fetchData } from '../../../commonApi';
import contactUsActiveIcon from '../../../images/contactUsIconActive.svg';
import contactUsIcon from '../../../images/contactUsIcon.svg';
import VerifyEmailModal from '../Modals/VerifyEmailModal';
import { useDispatch, useSelector } from 'react-redux';
import socialLinksIcon from '../../../images/socialLinksIcon.svg';
import AppLogo from "../components/AppLogo";
import { togglemenu } from '../../../redux/actions/share';
import UpdatePasswordModal from '../Modals/UpdatePasswordModal';
import { UpdateUPassActionCreators } from '../../../redux/actions/updateUserPassword';
import { closeNotiPopup, openNotiPopup, updateMessagesCount, updateNotiPopState } from '../../../redux/actions/notificationAC';
import _ from 'lodash';
import SocialLinksModal from '../Modals/SocialLinksModal';
import openSLinksModalActionCreators from '../../../redux/actions/socialLinksModal';
import { pulsationHelper } from '../../../helpers/pulsationHelper';
import { AuthContext } from '../../../App';
import { removeFCMToken, setTokenSentFlag } from '../../../configs/firebaseToken';
import { EVerifyModal } from '../../../redux/actions/everify';
import { getForumsNConfessions } from '../../../components/forums/services/forumServices';
import { useNavigate } from 'react-router-dom';
import { searchAcFn } from '../../../redux/actions/searchAc/searchAc';
import { scrollToTop } from '../../../helpers/helpers';
import { getKeyProfileLoc } from '../../../helpers/profileHelper';
import { HeartComponent, ShareWithLoveModal, AppreciationModal } from '../components/sharepostwithlove/Sharepostwithlove';
import { toggleShareWithLoveModal } from '../../../redux/actions/shareWithLoveAc/shareWithLoveAc';


export default function Header(props) {

    const authContext = useContext(AuthContext)
    const messagesVisible = props?.messagesVisible
    let forceVisible
    const history = useNavigate()
    const ShareReducer = useSelector(store => store.ShareReducer);
    const SearchReducer = useSelector(store => store.SearchReducer);
    const verifyEState = useSelector(store => store.VerifyEmail);
    const searchBoxRef = useRef(null)
    const notificationReducer = useSelector(store => store.notificationReducer);
    const socialLinksModalReducer = useSelector(store => store.socialLinksModalReducer);
    const dispatch = useDispatch();
    const params = useParams();
    const pathname = useLocation().pathname.replace("/", "");
    const heartCompRef = useRef(null)
    const [profile] = useState(() => {
        if (auth()) {
            let profile = localStorage.getItem("userDetails");
            profile = JSON.parse(profile);
            profile = profile.profile;
            return profile;
        }
    });

    useEffect(() => {
        pulsationHelper()
        // Dont remove this line
        if (auth()) authContext()
    }, [])

    useEffect(() => {
        forceVisible = document.querySelector("html")?.scrollHeight < 1500 ?? false
        if (forceVisible === false) heartCompRef?.current?.classList?.remove("force_visible")
        else if (props?.propToWatch !== "") heartCompRef?.current?.classList?.add("force_visible")
    }, [props?.propToWatch])

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


    useEffect(() => {
        if (notificationReducer.isVisible === true) {
            document.addEventListener("click", catchEventNoti);
        }

        return () => {
            document.removeEventListener("click", catchEventNoti);
        }
    }, [notificationReducer.isVisible])


    // GETS THE COUNT OF NEW REQUESTS
    useEffect(() => {
        if (auth()) getUnreadCommentsCount();
    }, [])


    const catchEvent2 = (e) => {
        var classes = e.target.classList;
        if (!classes.contains("shareReqCont") && !classes.contains("shareReqRows") && !classes.contains("shareKitImgIcon") && !classes.contains("sharekitdots") && !classes.contains("dontHide")) {
            dispatch(togglemenu({
                id: null, value: false
            }))
        }
    }

    // useEffect(() => {

    // }, [SearchReducer.data])

    useEffect(() => {
        if (ShareReducer.selectedPost?.value) {
            document.addEventListener("click", catchEvent2);
        }
        return () => {
            document.removeEventListener("click", catchEvent2);
        }
    }, [ShareReducer.selectedPost?.value])


    useEffect(() => {
        getNotiStatus();
    }, [notificationReducer.data])



    //GETS THE TOTAL NO OF NEW COMMENTS
    const getUnreadCommentsCount = async (item) => {
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
                    let count = parseInt(res.data.friendrequests);
                    let count_ = parseInt(res.data.messages);
                    setNewCommentsCount(res.data.comments);

                    if (res.data.messages !== notificationReducer.messagesCount) {
                        dispatch(updateMessagesCount(res.data.messages))
                    }

                    setRequestIndicator(count);
                    localStorage.setItem("requestsCount", count);
                    localStorage.setItem("mssgCount", count_);

                    // IF NOTIFICATION DATA IS NOT UPDATED THE ONLY UPDATE IT
                    if (!_.isEqual(res.data.commentscenter, notificationReducer.data)) {
                        dispatch(updateNotiPopState({ data: res.data.commentscenter }))
                    }

                    // EMAIL VERIFICATION LOGIC
                    var email_verified = res.data.email_verified;   // 0 NOT VERIFIED , 1 VERIFIED

                    let currPath;

                    if (params.postId) {
                        currPath = `confession/${params.postId}`;
                    }

                    if (email_verified !== "" && email_verified === 0 && pathname !== currPath) {
                        if (verifyEState.verified === false) {
                            setShowEModal(true);
                        }
                    } else if (email_verified === 1 && verifyEState.verified === false) {
                        dispatch(EVerifyModal({ verified: true }))
                    }

                } else {
                    // console.log(res)
                };
            })
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        let interval;
        if (auth()) {
            interval = setInterval(() => { getUnreadCommentsCount(notificationReducer) }, 3000)
        }
        return () => {
            if (auth()) clearInterval(interval)
        }
    }, [notificationReducer.data, notificationReducer.messagesCount, verifyEState])



    // LOGS OUT THE USER
    const logout = async () => {
        SetAuth(0);
        localStorage.clear()
        setTokenSentFlag(false)
        removeFCMToken(false)

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


    // HANDLE NOTIFICATION DIV
    const catchEventNoti = (e) => {
        var classes = e.target.classList;
        let result = !classes.contains("takeActionNoti") && !classes.contains("noti") && !classes.contains("takeActionOptions") && !classes.contains("notificationIcon");
        if (result) {
            dispatch(closeNotiPopup());
        }
    }

    const HandleShowHide = () => {
        setShowProfileOption(!showProfileOption)
    }

    const openUpdatePassModal = () => {
        dispatch(UpdateUPassActionCreators.openChangePassModal())
    }
    // END OF HANDLE PROFILE DIV


    const toggleNotificationCont = () => {
        if (!notificationReducer.isVisible)
            return dispatch(openNotiPopup())

        dispatch(closeNotiPopup());
    }

    const toggleSearchBox = () => {
        if (SearchReducer.visible) {
            return dispatch(searchAcFn({
                visible: false
            }))
        }

        dispatch(searchAcFn({
            visible: true
        }))

    }

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        const scroll = () => {
            let secondPostElem = document.querySelector("html")
            if (heartCompRef?.current) {
                if (secondPostElem?.scrollTop > 600) heartCompRef?.current?.classList?.remove("hideHeartComp")
                else heartCompRef?.current?.classList?.add("hideHeartComp")
            }
        }

        document.addEventListener("scroll", scroll);
        return () => {
            window.removeEventListener("scroll", scroll);
        }
    }, [])

    useEffect(() => {
        if (messagesVisible === true) heartCompRef?.current?.classList?.remove("force_visible")
        if (messagesVisible === false) heartCompRef?.current?.classList?.add("force_visible")
    }, [messagesVisible])


    // Open share iwth love modal
    const openSharewithLoveModal = () => {
        dispatch(toggleShareWithLoveModal({
            visible: true
        }))
    }


    const getNotiHtml = () => {
        let data, arr, html, count = 0, arrForums;
        data = notificationReducer.data;
        arr = [{ iconClass: "fa fa-comments", label: "You have got a new comment on your post" },
        { iconClass: "fa fa-envelope", label: "You have got a new reply on your comment" },
        { iconClass: "fa fa-comment-o", label: "You have got a new reply on your reply" },
        { iconClass: "fa fa-comment-o", label: "You have got a new reply on your reply" },
        { iconClass: "fa fa-ban", label: "No new notifications" }]
        arrForums = [{ iconClass: "fa fa-comments", label: "You have got a new comment on your forum" },
        { iconClass: "fa fa-envelope", label: "You have got a new reply on your comment" },
        { iconClass: "fa fa-comment-o", label: "You have got a new reply on your reply" },
        { iconClass: "fa fa-comment-o", label: "You have been tagged in a forum" },
        { iconClass: "fa fa-ban", label: "No new notifications" }]


        if (data.length === 0) {
            return (<div type="button" className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                <i className={arr[arr.length - 1].iconClass} aria-hidden="true"></i>
                {arr[arr.length - 1].label}
            </div>)

        }

        // console.log(first)

        let link = "";
        let typeOfForum = 2;


        html = data.map((curr, index) => {
            let isForum = +curr?.ptype === typeOfForum
            if (curr.is_unread === 1)
                count++;

            link = `/${(isForum ? "forums" : "confession")}/${curr.slug
                }`;

            return <Link
                className='notiDivsLinkTag'
                key={'notiDivs' + curr.confession_id + 'type' + curr.type + Math.floor(Math.random() * 1000000)}
                onClick={() => { dispatch(closeNotiPopup()) }}
                to={link}>
                <>
                    {index > 0 && <hr className="m-0" />}
                    <div type="button" className={`takeActionOptions takeActionOptionsOnHov textDecNone py-2 ${curr.is_unread === 1 ? 'unread' : ''}`}>
                        {isForum ?
                            <i className={arr[curr.type - 1].iconClass} aria-hidden="true"></i> :
                            <i className={arrForums[curr.type - 1].iconClass} aria-hidden="true"></i>}
                        <span className='notificationLabel'>
                            {isForum ? arrForums[curr.type - 1].label : arr[curr.type - 1].label}
                        </span>
                    </div>
                </>
            </Link>
        })

        return html;
    }


    function getNotiStatus() {

        let data, count = 0;
        data = notificationReducer.data;
        data.forEach(function (curr) {
            if (curr.is_unread === 1) {
                count++;
            }
        })

        if (count > 0 && notificationReducer.newNotifications !== true) {
            dispatch(updateNotiPopState({ newNotifications: true }))
        }

        if (count === 0 && notificationReducer.newNotifications !== false) {
            dispatch(updateNotiPopState({ newNotifications: false }));
        }

    }


    // OPENS SOCIAL LINKS MODAL
    const openSocialLinksModal = () => {
        dispatch(openSLinksModalActionCreators.openModal());
    }

    const checkKeyPressed = (event, updateValue = true) => {
        const isSearchPage = pathname === "search"
        const value = event.target.value;
        if (updateValue) {
            if (isSearchPage)
                scrollToTop()

            dispatch(searchAcFn({
                searchStr: value,
            }))
        }

        // if (event.code === "Enter" && !isSearchPage) return history("/search")
    }

    const navigateToSearch = (e) => {
        e.preventDefault();
        dispatch(searchAcFn({
            visible: false,
            searchedWith: searchBoxRef.current?.value,
            page: 1
        }))

        getForumsNConfessions({
            SearchReducer: {
                ...SearchReducer,
                searchedWith: searchBoxRef.current?.value,
                dispatch,
                append: false
            }
        })

        history("/search")
    }


    useEffect(() => {
        const listener = (e) => {
            const toIgnore = ["seach_boxinput", "headerUserAccIcon", "search_box"]
            const elementClass = e.target.classList
            let ignorableItem = false;
            toIgnore.forEach(curr => {
                if (elementClass.contains(curr)) ignorableItem = true
            })
            if (!ignorableItem) {
                dispatch(searchAcFn({ visible: false }))
            }
        }
        if (SearchReducer.visible) {
            document.addEventListener("click", listener)
        }
        return () => {
            document.removeEventListener("click", listener)
        }
    }, [SearchReducer.visible])


    return (
        <>
            <header className={`mainHead col-12 posFixedForHeader ${props.fullWidth ? "fullWidthHeader" : ''} ${props.hideRound ? "hideHeaderProfile" : ""}`}>
                {verifyEState && verifyEState.verified === false && <VerifyEmailModal showEModal={showEModal} />}
                <div className="insideHeader">
                    <div className="headerLeftCol pl-0">
                        <span to="/home" className="homeHeaderLink">
                            <AppLogo />
                        </span>
                    </div>
                    <div className="viewProfileIcon pr-md-0 pr-lg-4">
                        <div className="row align-items-center justify-content-end m-0 navigationIcons">
                            {props.links ?

                                <div className={` d-none d-md-block pr-0`}>
                                    <div className={`linksCont container-fluid`}>
                                        <div className="linkBtns" onClick={props?.refreshFeed}>
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
                                            <NavLink to="/forums" className="headerNavLinks">
                                                <span className="headIconCont">
                                                    <img src={confessIconActive} alt="confessIconActive" className='active' />
                                                    <img src={confessIcon} alt="confessIcon" className='inactive' />
                                                </span>
                                                <span className={`headLinkName ${currentUrl === "forums" ? "activeLinkOfHeader" :
                                                    ""}`}>Forums</span>
                                            </NavLink>
                                        </div>

                                        {/* 3x icons are being used */}

                                        {
                                            authenticated[0] ? <div className="linkBtns">
                                                <NavLink to="/chat" className="headerNavLinks">
                                                    <span className="headIconCont">
                                                        <img src={currentUrl === 'chat' ? inboxIconActive : inboxIcon} alt="" />
                                                    </span>
                                                    <span className={`headLinkName ${notificationReducer.messagesCount > 0 ? 'newInboxMessages' : ''} ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Inbox</span>
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


                            {!auth() ? <div
                                className='socialLinksIconWrapper authProfileIcon'
                                pulsate='07-07-22,pulsatingIcon mobile'>
                                <img
                                    src={socialLinksIcon}
                                    alt="socialLinksIcon"
                                    onClick={openSocialLinksModal} />
                            </div> : null}

                            {auth() ?
                                (
                                    <>
                                        {/* Search icon */}
                                        <div className="authProfileIcon noti search_box_cont">
                                            <div className="notifications search_box"
                                                onClick={toggleSearchBox}
                                                pulsate='07-07-22,pulsatingIcon mobile'>
                                                <img src={searchIconActive} alt="" className="headerUserAccIcon mobile_view" />
                                                <img src={!SearchReducer.visible ? searchIcon : searchIconActive} alt="" className={`headerUserAccIcon web_view`} />
                                            </div>
                                            {SearchReducer.visible ?
                                                (
                                                    <form className='search_form' onSubmit={navigateToSearch}>
                                                        <input
                                                            type="text"
                                                            value={SearchReducer?.searchStr ?? ""}
                                                            onChange={(e) => checkKeyPressed(e)}
                                                            onKeyDown={(e) => checkKeyPressed(e, false)}
                                                            placeholder='Search'
                                                            ref={searchBoxRef}
                                                            className="seach_boxinput" />
                                                    </form>
                                                )
                                                : null}
                                        </div>
                                        {/* Search icon */}

                                        <div className="authProfileIcon noti">
                                            <div className="notifications"
                                                onClick={toggleNotificationCont}
                                                pulsate='07-07-22,pulsatingIcon mobile'>

                                                <img src={bell} alt="" className="notificationIcon headerUserAccIcon" />

                                                <img src={bellActive} alt="" className="notificationIcon headerUserAccIcon mobIcon" />

                                                {notificationReducer.newNotifications && (
                                                    <span className="requestIndicator"></span>
                                                )}
                                            </div>

                                            {notificationReducer.isVisible &&
                                                <div className="takeActionNoti p-1 pb-0 d-block">
                                                    <div className="NotiWrapper">
                                                        {getNotiHtml()}
                                                    </div>
                                                </div>}
                                        </div>


                                        <div className="authProfileIcon" onClick={HandleShowHide}>
                                            <span className="requestsIndicatorNuserIconCont" type="button">

                                                <img src={profile?.image === '' ? userIcon : profile?.image} alt="" className='userAccIcon headerUserAccIcon' />

                                                <img src={profile.image === '' ? mobileProfileIcon : profile.image} alt="" className='userAccIcon headerUserAccIcon mobIcon' />

                                                {requestsIndicator > 0 && (
                                                    <span className="requestIndicator"></span>
                                                )}

                                                {getKeyProfileLoc("email_verified") === 1 ?
                                                    <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                                            </span>

                                            {showProfileOption && <div className="takeAction p-1 pb-0 d-block">
                                                <Link to="/profile" className="textDecNone border-bottom">
                                                    <div type="button" className="profileImgWithEmail takeActionOptions d-flex align-items-center mt-2 textDecNone">
                                                        <span className="profileHeaderImage">
                                                            <img src={profile.image === '' ? mobileProfileIcon : profile.image} alt="" />

                                                            {getKeyProfileLoc("email_verified") === 1 ?
                                                                <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}

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
                                                <hr className="m-0" />
                                                <div
                                                    type="button"
                                                    onClick={openSocialLinksModal}
                                                    className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                                    <img
                                                        src={follow_usIcon}
                                                        alt="socialLinksIcon"
                                                        className='profilePopUpIcons' />
                                                    <span className="viewProfileNcommentsCont">
                                                        <div className='userProfileHeading'>
                                                            Follow us
                                                        </div>
                                                    </span>
                                                </div>
                                                <Link to="/profile" className="textDecNone border-bottom">
                                                    {requestsIndicator > 0 ?
                                                        <>
                                                            <hr className="m-0" />
                                                            <div type="button" className="takeActionOptions takeActionOptionsOnHov textDecNone py-2">
                                                                <img src={friendRequests} alt="" className='profilePopUpIcons friendReqIcon diff' />
                                                                <span className="viewProfileNcommentsCont">
                                                                    <div className='userProfileHeading'>
                                                                        Friend requests
                                                                    </div>
                                                                    {
                                                                        requestsIndicator > 0 &&
                                                                        <div className='userProfileSubHeadings'>
                                                                            {requestsIndicator > 1 ?
                                                                                `${requestsIndicator} Friend Requests` :
                                                                                `${requestsIndicator} Friend Request`}
                                                                        </div>
                                                                    }
                                                                </span>
                                                            </div>
                                                        </> : null}
                                                </Link>

                                                {profile?.source === 1 &&
                                                    <>
                                                        <hr className="m-0" />
                                                        <div type="button"
                                                            onClick={openUpdatePassModal} className="takeActionOptions  userProfileHeading takeActionOptionsOnHov userProfileHeading textDecNone py-2">
                                                            <img src={profileResetPass} alt="" className='profilePopUpIcons' />
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
                                    </>
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


            {/* SOCIAL LINKS MODAL */}
            <SocialLinksModal
                visible={socialLinksModalReducer.visible}
            />

            {/* Appriciation Modal */}
            <AppreciationModal />
            {/* Appriciation Modal */}

            {/* UPDATE PASSWORD MODAL */}
            <UpdatePasswordModal />

            <ShareWithLoveModal getConfessions={props?.getConfessions ?? (() => { })} />
            <div
                pulsate='28-10-22,pulsatingIcon mobile'
                className={`heartCompCont hideHeartComp cursor_pointer`}
                onClick={openSharewithLoveModal}
                ref={heartCompRef}>
                <HeartComponent />
            </div>
        </>
    );
}
