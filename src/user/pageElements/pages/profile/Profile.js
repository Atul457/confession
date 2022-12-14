import React, { useState, useEffect, useRef } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Post from '../../components/Post';
import Requests from '../../components/Requests';
import pen from '../../../../images/whitepen.png';
import downArrowIcon from '../../../../images/downArrow.png';
import supportIcon from '../../../../images/contactUsIconActive.svg';
import verifiedIcon from '../../../../images/verifiedIcon.svg';
import { Link } from "react-router-dom";
import SiteLoader from '../../components/SiteLoader';
import { useNavigate } from "react-router-dom";
import auth from '../../../behindScenes/Auth/AuthCheck';
import userIcon from '../../../../images/userAcc.png';
import { fetchData } from '../../../../commonApi';
import Friends from '../../components/Friends';
import InfiniteScroll from "react-infinite-scroll-component";
import ExtValidator from '../../../../extensionValidator/ExtValidator';
import useCommentsModal from "../../../utilities/useCommentsModal";
import RefreshButton from '../../../refreshButton/RefreshButton';
import DeleteConfessionModal from '../../Modals/DeleteConfessionModal';
import editCommentIcon from '../../../../images/editCommentIcon.png';
import PofileModal from '../../Modals/PofileModal';
import AppLogo from '../../components/AppLogo';
import { useDispatch, useSelector } from 'react-redux';
import ReportCommentModal from '../../Modals/ReportCommentModal';
import { toggleAvatarModal } from '../../../../redux/actions/avatarSelModalAC';
import AvatarSelModal from '../../Modals/AvatarSelModal';
import defaultIcon from '../../../../images/mobileProfileIcon.svg';
import { getKeyProfileLoc } from '../../../../helpers/profileHelper';
import Badge from '../../../../common/components/badges/Badge';

const deletePostModalIniVal = { visible: false, data: { postId: null, index: null } };


export default function Profile() {

    let history = useNavigate();
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        if (!auth()) {
            history("/login");
        }
    }, [history])

    if (!auth()) {
        window.location.href = "/login";
    }


    let maxRequestsToshow = 5;
    const unread = useRef();
    const dispatch = useDispatch()
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("userDetails")));
    const { commentsModalReducer, avatarModalReducer } = useSelector(state => state);
    const [runOrNot, setRunOrNot] = useState(false);
    const [displayName, setDisplayName] = useState(false);
    const [profile, setProfile] = useState(userDetails.profile);
    const [myConfession, setMyConfession] = useState([]);
    const [isConfLoading, setIsConfLoading] = useState(true);
    const [isConfError, setIsConfError] = useState(false);
    const [showFriendsList, setShowFriendsList] = useState(false);
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [myRequests, setMyRequests] = useState({ count: 0 });   //TO MAINTAIN THE DESIGN
    const [isReqLoading, setIsReqLoading] = useState(true);
    const [isReqError, setIsReqError] = useState(false);
    const [confCount, setConfCount] = useState(0);
    const [confData, setConfData] = useState(1);
    const [deletable, setDeletable] = useState(false);
    const [deleteConfModal, setDeleteConfModal] = useState(deletePostModalIniVal);
    const [profileModal, setProfileModal] = useState({
        visible: false,
    })
    //CUSTOM HOOK
    const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentGotModal] = useCommentsModal();
    const [dataObj] = useState({
        confData:
        {
            profile_id: ''
        },
        requestsData:
        {
            page: 1
        }
    });
    const [profileImg, setProfileImg] = useState({
        isLoading: false,
        data: getKeyProfileLoc("image") ?? "",
        isError: false
    });

    const [myFriends, setMyFriends] = useState({
        config: {
            token: userDetails.token,
            page: 1
        },
        isLoading: true,
        isError: false,
        data: { count: 0, friends: [] }
    });


    const getFriends = async (pageNo = 1, append = false) => {
        let data = {
            page: pageNo === "" ? 1 : pageNo,
        }
        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getfriends"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                setMyFriends({
                    ...myFriends,
                    isLoading: false,
                    data: {
                        count: res.data.count,
                        friends: append === true ? [...myFriends.data.friends, ...res.data.friends] : res.data.friends,
                    }
                });

            } else {
                setMyFriends({ ...myFriends, isLoading: false });
            }
        } catch {
            setMyFriends({ ...myFriends, isLoading: false, isError: true });
        }
    }


    //SETS NAME AND POST AS ANONYMOUS 
    const handleProfile = (event) => {
        let { type } = event;
        if (type === 'checkbox') {
            let { name, checked } = event;
            setRunOrNot(true);
            setProfile({ ...profile, [name]: checked ? 1 : 0 });
        }
        else {
            setRunOrNot(true);
            let { name, value } = event;
            setProfile({ ...profile, [name]: value });
        }
    }


    const updateProfile = async () => {
        if (runOrNot) {

            let data = {
                image: profileImg.imagepath,
                post_as_anonymous: profile.post_as_anonymous,
                display_name: profile.display_name,
                view_previous_invoice: (profile.view_previous_invoice).toString(),
                is_avatar: profile.is_avatar
            }

            let obj = {
                data: data,
                token: userDetails.token,
                method: "post",
                url: "updateprofile"
            }

            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    let dataToSet = {
                        token: userDetails.token,
                        profile: { ...res.data.user, ...{ comments: res.data?.comments ?? getKeyProfileLoc("comments") } }
                    }
                    setUserDetails(dataToSet);
                    setRunOrNot(false);
                    setProfileImg({
                        isLoading: false,
                        ...profileImg,
                        data: res.data.user?.image
                    })
                    setProfile({ ...res.data.user })
                    localStorage.setItem("userDetails", JSON.stringify(dataToSet));
                } else {
                    console.log("failed to update");
                }
            } catch {
                console.log("some error occured");
            }
        }
    }

    useEffect(() => {
        if (profile.display_name !== "") {
            updateProfile();
        }
    }, [profile])


    async function getData(page = 1, append = false) {

        let pageNo = page;
        let data = {
            profile_id: dataObj.confData.profile_id,
            page: pageNo,
            only_unread: parseInt(unread.current?.value)
        }

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getmyconfessions"
        }

        try {
            const res = await fetchData(obj);
            if (res.data.status === true) {
                //WHETHER THE POSTS DELETABLE OR NOT
                if (res.data.is_deleteable && res.data.is_deleteable === 1) {
                    setDeletable(true)
                }

                if (append === true)                //APPEND
                {
                    let newConf = [...myConfession, ...res.data.confessions];
                    setMyConfession(newConf);
                    setConfData(page);
                } else                              //OVERWRITE
                {
                    setConfCount(res.data.count);
                    setMyConfession(res.data.confessions);
                }
            }
            setIsConfLoading(false);
        } catch {
            setIsConfError(true)
            setIsConfLoading(false);
        }
    }


    //GET MY CONFESSIONS
    useEffect(() => {
        getData();
    }, [dataObj.confData, userDetails.token])

    const confFilter = () => {
        getData();
    }

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        const isMobile = window.innerWidth < 768
        const ref = isMobile ? document.getElementById("postsWrapper") : document;

        const handleArrow = () => {
            let scroll = isMobile ? document.querySelector("#postsWrapper").scrollTop : window?.scrollY;
            if (scroll > 1000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        }

        ref.addEventListener("scroll", handleArrow)

        return () => {
            ref.removeEventListener("scroll", handleArrow)
        }

    }, [window.innerWidth])


    //SCROLLS TO BOTTOM
    const goUp = () => {
        const isMobile = window?.innerWidth < 768
        let ref = isMobile ? document.getElementById("rightColumnFeed") : window;
        ref.scrollTo({ top: "0px", behavior: "smooth" });
    }


    const getRequests = async () => {
        let data = dataObj.requestsData;

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "getfriendrequests"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                localStorage.setItem("requestsCount", res.data.count);
                setMyRequests(res.data);

                // OPENS THE FRIEND LIST DROPDOWN IF THERE A FRIEND REQUESTS
                if (res.data?.requests && res.data?.requests.length > 0) {
                    let windowWidth = window.innerWidth
                    if (windowWidth < 768) return setProfileModal({ visible: true })
                    setShowFriendsList(true)
                }
            }
            setIsReqLoading(false)
        } catch {
            setIsReqError(true);
            setIsReqLoading(false);
        }
    }

    //GET FRIEND REQUESTS
    useEffect(() => {
        getRequests();
        getFriends();
    }, [])


    //ACCEPTS OR REJECTS REQUEST
    const updateFriendCount = async (status, request_id) => {
        let data = {
            request_id: request_id,
            status: status
        }

        let obj = {
            data: data,
            token: userDetails.token,
            method: "post",
            url: "updatefriendrequeststatus"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                getRequests();
                if (status === 1) getFriends();
            }
        } catch {
            console.log("Some error occured");
        }
    }


    const changeProfilePic = () => {
        let profileImage = profile.image === "" ? defaultIcon : profile.image
        dispatch(toggleAvatarModal({
            visible: true,
            defaultImg: profileImage
        }))
    }

    const uploadImage = link => {
        setRunOrNot(true);
        setProfileImg({
            ...profileImg,
            isLoading: false,
            imagepath: link,
            is_avatar: 1
        })
        setProfile({ ...profile, image: link, is_avatar: 1 });
    }


    //IMG TO BASE 64 CONVERSION
    const toBase64 = (e) => {

        if (e.target.files[0]) {

            let fileObj;
            fileObj = e.target.files[0];

            //PREVENTS UNSPECIFIED EXTENSION FILESS
            if (!ExtValidator(fileObj)) {
                return false;
            }


            setRunOrNot(true);
            let file, reader, data, base64String
            setProfileImg({ ...profileImg, isLoading: true });
            file = e.target.files[0];
            reader = new FileReader();
            reader.onloadend = async () => {
                base64String = reader.result;

                data = {
                    "image": base64String,
                    folder: "user-images",
                };


                let obj = {
                    data: data,
                    token: "",
                    method: "post",
                    url: "uploadimage"
                }
                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        setProfileImg({
                            ...profileImg,
                            imagepath: res.data.imagepath,
                            is_avatar: 0
                        })
                        setProfile({ ...profile, image: res.data.imagepath, is_avatar: 0 });
                    } else {
                        setProfileImg({
                            ...profileImg,
                            isError: true,
                            isLoading: false
                        });
                    }
                } catch {
                    console.log("Some error occured");
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const fetchMoreConfessions = () => {
        getData((confData + 1), true);
    }

    const fetchMoreFriends = () => {
        setMyFriends({
            ...myFriends, "config": {
                ...myFriends.config
            }
        })
        getFriends(myFriends.config.page + 1, true);
    }


    useEffect(() => {
        if (displayName === true) {
            const elem = document.getElementById("displayName");
            elem.focus();
        }
    }, [displayName])


    const updateConfessionData = (_viewcount, sharedBy, index) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        let shared = sharedBy;
        updatedConfessionArray = [...myConfession];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            "no_of_comments": shared,
            "viewcount": _viewcount
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setMyConfession([...updatedConfessionArray]);
    }


    const updatedConfessions = (index, data) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = [...myConfession];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setMyConfession([...updatedConfessionArray]);
    }


    // IS CALLED FROM THE POST COMPONENT AND RECIEVES THE POST ID AND INDEX,
    // THEN OPENS THE DELETED CONFESSION MODAL AND PASSES THE PARAMS INTO IT
    const deletePostModal = (confessionId, index) => {
        setDeleteConfModal({ visible: true, data: { postId: confessionId, index: index } });
    }


    // RESETS THE STATE OF DELETE CONFESSION MODAL
    const closeDeletePostModal = () => {
        setDeleteConfModal(deletePostModalIniVal);
    }


    //IS CALLED FROM DELETE CONFESSION MODAL 
    const deletePost = (confessionId, index) => {
        let updatedConfessionArray;
        if (confessionId && index !== "") {

            closeDeletePostModal();
            async function deleteMyPost() {
                let obj = {
                    data: {},
                    token: userDetails.token,
                    method: "get",
                    url: `deleteconfession/${confessionId}`
                }
                try {
                    const res = await fetchData(obj)
                    if (res.data.status === true) {
                        updatedConfessionArray = [...myConfession];
                        updatedConfessionArray.splice(index, 1);
                        setMyConfession(updatedConfessionArray);
                    } else {
                        console.log(res);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            deleteMyPost();
        } else {
            console.log({ confessionId, index });
        }
    }

    const toggleFriendList = () => {
        setShowFriendsList(!showFriendsList)
    }

    const toggleEditProfile = () => {
        setShowProfileEdit(!showProfileEdit);
    }


    const hideProfileModal = () => {
        setProfileModal({
            visible: false
        })
    }

    const showProfileModal = () => {
        setProfileModal({
            visible: true
        })
    }


    return (
        <div className="container-fluid toUp">
            {auth() ?
                <div className="row">

                    {/* POPUP MODAL TO SHOW COMMENTS */}
                    {commentsModalReducer.visible && <CommentGotModal
                        handleChanges={handleChanges}
                        updateConfessionData={updateConfessionData}
                        state={commentsModal}
                        handleCommentsModal={handleCommentsModal} />}

                    {/* DELETECONFESSIONMODAL */}
                    {
                        deleteConfModal.visible && <DeleteConfessionModal
                            deleteConfModal={deleteConfModal}
                            closeDeletePostModal={closeDeletePostModal}
                            deletePost={deletePost} />
                    }


                    {/* ADDS HEADER COMPONENT */}
                    <Header links={true} hideRound={true} getConfessions={getData} propToWatch={myConfession} />
                    <div className="leftColumn leftColumnFeed mypriflelocc profileSidebar">
                        <div className="leftColumnWrapper">
                            <AppLogo />

                            <div className="middleContLoginReg feedMiddleCont profile">
                                {/* CATEGORYCONT */}
                                <aside className="posSticky">

                                    <div className="profileDetailsCont">
                                        <span className='round11'>
                                            <span className='round22'>
                                                <span className='round33'>
                                                    <span className="profilePicCont">
                                                        {profileImg.isLoading
                                                            ?
                                                            (<div className="spinner-border text-white w-25 h-25" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>)
                                                            :
                                                            (
                                                                <span className="profilePicCont">
                                                                    <img
                                                                        src={profileImg.data === "" ? userIcon : profileImg.data}
                                                                        className="loggedInUserPic"
                                                                        type="button"
                                                                        alt=""
                                                                        onClick={changeProfilePic}
                                                                    />

                                                                    {profile?.email_verified === 1 ?
                                                                        <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                                                                </span>)}

                                                        <input
                                                            type="file"
                                                            className="d-none"
                                                            id="profilePicP"
                                                            accept=".jpeg, .png, .jpg, .gif"
                                                            onChange={(e) => { toBase64(e) }} />
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="loggedInUserName mt-2">
                                            <div className="left">
                                                <span className="firstName">
                                                    {profile.display_name}
                                                </span>
                                                <Badge points={profile?.points} classlist="ml-2" />
                                            </div>
                                            <div className="right">
                                                <img src={editCommentIcon} className="editCommentIcon profile" onClick={toggleEditProfile} />
                                            </div>
                                        </span>

                                        <div className={`editProfileCont ${showProfileEdit ? "" : "height0"}`}>

                                            {displayName === false
                                                ?
                                                (<span
                                                    className="editProfile mtProfile"
                                                    type="button"
                                                    onClick={(e) => { setDisplayName(true) }}>
                                                    <img src={pen} alt="" className="penImg" />
                                                    Edit Display Name
                                                </span>)
                                                :
                                                (<span className="mtProfile">
                                                    <input type="text"
                                                        name="display_name"
                                                        className='form-control dname'
                                                        id="displayName"
                                                        placeholder="Display Name"
                                                        onBlur={(e) => {
                                                            setDisplayName(false);
                                                            // BECAUSE DISPLAYNAME IS MONDOTORY
                                                            if (e.target.value !== '') {
                                                                handleProfile(e.target);
                                                            }
                                                        }}
                                                        defaultValue={profile.display_name} />
                                                </span>)
                                            }

                                        </div>

                                        <div className="form-group mb-0 radioCont wProfile mx-auto mtProfile withInfo">
                                            <label htmlFor="postAnanonymsly" className="labelForToggle profilePageLabels">Randomized name</label>
                                            <input
                                                type="checkbox"
                                                className="switch12 profile"
                                                name="post_as_anonymous"
                                                id="postAnanonymsly"
                                                defaultChecked={parseInt(profile.post_as_anonymous) === 0 ? false : true}
                                                onChange={(e) => handleProfile(e.target)} />

                                            <i
                                                className="fa fa-info-circle viewPrevPostIn"
                                                aria-hidden="true"></i>

                                            <div className="ljkdjfkl">
                                                Enabling this will assign you random names whenever you post, comment, etc.
                                            </div>

                                        </div>
                                        <div className="form-group mb-0 radioCont wProfile mx-auto mtProfile withInfo">
                                            <label htmlFor="postAnanonymsly" className="labelForToggle profilePageLabels">Show Posts</label>
                                            <input
                                                type="checkbox"
                                                className="switch12 profile"
                                                name="view_previous_invoice"
                                                id="postAnanonymsly"
                                                defaultChecked={parseInt(profile.view_previous_invoice) === 0 ? false : true}
                                                onChange={(e) => handleProfile(e.target)} />

                                            <i
                                                className="fa fa-info-circle viewPrevPostIn"
                                                aria-hidden="true"></i>

                                            <div className="ljkdjfkl">
                                                Enabling this will show or hide your posts to users visiting your profile.
                                            </div>
                                        </div>

                                        <Link to="/report" className="profile_contact_us_link">
                                            <div className="form-group wProfile contantSupportCont mtProfile d-flex">
                                                <label className="profilePageLabels">Contact Support</label>
                                                <span className="callingImgSpan">
                                                    <img src={supportIcon} alt="" className="callingImg" />
                                                </span>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* edited */}
                                    {/* start of requestnChatWrapper */}


                                    <div className={`friendRequestsHeader ${myRequests.count === 0 && (myFriends.data.friends).length === 0 ? "d-none" : ""}`} type="button" onClick={toggleFriendList}>
                                        <span className="requestsHeaderTitle profile">
                                            Friends List
                                        </span>

                                        {showFriendsList ?
                                            <i className="fa fa-minus" aria-hidden="true"></i> :
                                            <i className="fa fa-plus" aria-hidden="true" ></i>}
                                    </div>

                                    <div className={`${myRequests.count === 0 && (myFriends.data.friends).length === 0 ? "d-none" : ""} friendRequestsHeader toggleModal`} type="button" onClick={showProfileModal}>
                                        <span className="requestsHeaderTitle profile ">
                                            Friends List
                                        </span>

                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>

                                    <div className={`requestnChatWrapper ${showFriendsList ? "" : "height0"} ${myRequests.count === 0 && ((myFriends.data.friends).length === 0) ? "height0" : ""}`}>
                                        <div className={`d-none ${myRequests.count ? "d-md-block" : "d-md-none"}`}>
                                            {!isReqError
                                                ?
                                                !isReqLoading ?
                                                    <div className="friendsRequestsMainCont">

                                                        {((myRequests.requests && myRequests.requests.length) ? (myRequests.requests).map((requester, index) => {
                                                            return index < maxRequestsToshow && (
                                                                <Requests
                                                                    requester={requester}
                                                                    updateFriendCount={updateFriendCount}
                                                                    request_id={requester.request_id}
                                                                    key={`${index}${requester.image}${requester.name}${requester.no_of_confessions}`}
                                                                    imgUrl={requester.image === '' ? userIcon : requester.image} requesterName={requester.name}
                                                                    requestersTotalSharedConf={requester.no_of_confessions} />)
                                                        }) : <div className="endListMessage">No Requests to show</div>)}

                                                    </div> :
                                                    (<div className="text-center">
                                                        <div className="spinner-border pColor mt-4 text-center" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                    ) : <div className="alert alert-danger" role="alert">
                                                    Unable to get Requests
                                                </div>}
                                        </div>
                                        {/* edited */}

                                        <div className="d-md-block">
                                            {
                                                myFriends.isLoading ?
                                                    (<div className="text-center">
                                                        <div className="spinner-border pColor text-center mt-5" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>) :
                                                    (myFriends.isError ?
                                                        (<div className="alert alert-danger" role="alert">
                                                            Something went wrong
                                                        </div>) :
                                                        (myFriends.data.friends.length > 0 &&
                                                            <>
                                                                <div className="profileFriendsCont w-100" id="friendList">

                                                                    <InfiniteScroll
                                                                        scrollableTarget={`friendList`}
                                                                        endMessage={<div className="endListMessage mt-4 text-center">End of FriendList</div>}
                                                                        dataLength={myFriends.data.count}
                                                                        next={fetchMoreFriends}
                                                                        hasMore={myFriends.data.friends.length < myFriends.data.count}
                                                                        loader={
                                                                            <div className="text-center mt-2" style={{ zIndex: 0 }}>
                                                                                <div className="spinner-border pColor" role="status">
                                                                                    <span className="sr-only">Loading...</span>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    >
                                                                        {/* SHOWS ALL FRIENDS */}
                                                                        {
                                                                            myFriends.isLoading ?
                                                                                (<div className="text-center">
                                                                                    <div className="spinner-border pColor text-center" role="status">
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </div>
                                                                                </div>) :
                                                                                (myFriends.isError ?
                                                                                    (<div className="alert alert-danger" role="alert">
                                                                                        Something went wrong
                                                                                    </div>) :
                                                                                    (myFriends.data.friends.length ?
                                                                                        (myFriends.data.friends).map((user, index) => {
                                                                                            return <Friends
                                                                                                updated_at={user.updated_at}
                                                                                                friend={user}
                                                                                                key={`${index}${user.imgUrl}${user.name}${user.chatterDesc}`}
                                                                                                is_userreport={user.is_userreport}
                                                                                                is_online={user.is_online}
                                                                                                channel_id={user.channel_id}
                                                                                                no_of_confessions={user.no_of_confessions}
                                                                                                friend_id={user.friend_id}
                                                                                                imgUrl={user.image === '' ? userIcon : user.image}
                                                                                                chatterName={user.name} chatterDesc={!user.last_messsage ? "No Messages found" : user.last_messsage} />
                                                                                        }) : 'No Friends Available')
                                                                                )
                                                                        }
                                                                    </InfiniteScroll>

                                                                </div>
                                                            </>
                                                        )
                                                    )
                                            }
                                        </div>

                                    </div>

                                    {/* end of requestnChatWrapper */}
                                </aside>
                                {/* CATEGORYCONT */}
                            </div>
                        </div>
                    </div>
                    <div className="preventHeader profile">preventHead</div>
                    <div className="rightColumn rightColumnFeed rightColumnFeedppage profile" id="rightColumnFeed">

                        <div className="roundCorners">__</div>
                        <div className="postsHeadingProfile profile">
                            My Posts
                            <div className="form-group createPostInputs filterByUnread createInputSelect mb-0">
                                <select
                                    className='form-control createInputSelect'
                                    ref={unread}
                                    onChange={confFilter}
                                    defaultValue={0}>
                                    <option value="0">Filter by</option>
                                    <option value="0">All</option>
                                    <option value="1">Unread</option>
                                    <option value="2">Recent Comments</option>
                                </select>
                                <img src={downArrowIcon} alt="" type="button" />
                            </div>
                        </div>
                        <div className="thoughtsNrequestsCont container-fluid profile" id="postsWrapper">
                            <div className="row w-100 mx-0">

                                <div className="col-12 container-fluid">
                                    <div className="row flex-column-reverse flex-md-row">

                                        <div className={`col-12 w-100 ${(myConfession && myConfession.length > 0 && myRequests.count === 0 && myFriends.data.friends.length === 0) ? "col-md-12" : "col-md-12"} col-md-12 transition col-md-12 p-0`}>
                                            {/* MYCONFESSIONS */}

                                            {!isConfError
                                                ?
                                                (!isConfLoading ? ((myConfession && myConfession.length) ?

                                                    <InfiniteScroll
                                                        scrollableTarget={`${((window.innerWidth - 13) > 768) ? '' : 'postsWrapper'}`}
                                                        endMessage={<div className="endListMessage mt-4 pb-3 text-center">End of Confessions</div>}
                                                        dataLength={myConfession.length}
                                                        next={fetchMoreConfessions}
                                                        hasMore={myConfession.length < confCount}
                                                        loader={
                                                            <div className="w-100 text-center">
                                                                <div className="spinner-border pColor mt-4" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                            </div>
                                                        }
                                                    >

                                                        {myConfession.map((post, index) => {
                                                            return <Post
                                                                isReported={2}
                                                                post={post}
                                                                cover_image={post.cover_image ?? ''}
                                                                isNotFriend={post.isNotFriend}
                                                                key={index}
                                                                slug={post.slug}
                                                                deletable={deletable}
                                                                post_as_anonymous={false}
                                                                deletePostModal={deletePostModal}
                                                                index={index}
                                                                viewcount={post.viewcount}
                                                                handleCommentsModal={handleCommentsModal}
                                                                createdAt={post.created_at}
                                                                curid={null}
                                                                category_id={post.category_id}
                                                                profileImg={profile.image}
                                                                postId={post.confession_id}
                                                                imgUrl={(post.image === '' || null) ? null : post.image}
                                                                userName={post.created_by} category={post.category_name}
                                                                updateConfessionData={updateConfessionData}
                                                                postedComment={post.description}
                                                                sharedBy={post.no_of_comments}
                                                                updatedConfessions={updatedConfessions}
                                                                is_viewed={post.is_viewed}
                                                                like={post.like}
                                                                dislike={post.dislike}
                                                                unread_comments={post.unread_comments} />
                                                        }

                                                        )}
                                                    </InfiniteScroll>

                                                    : <div className="profile noConfessions endListMessage">
                                                        {parseInt(unread.current?.value) === 1 ?
                                                            "No post found" :
                                                            "You haven't created any post"}
                                                    </div>)
                                                    :
                                                    (<div className="text-center">
                                                        <div className="spinner-border pColor mt-4 text-center" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                    )) : <div className="alert alert-danger" role="alert">
                                                    Unable to get confessions
                                                </div>}

                                            {/* END OF MYCONFESSIONS */}
                                        </div>



                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* REFRESH BUTTON */}
                    {commentsModal.visibility === false && changes && <RefreshButton />}

                    <PofileModal
                        hideProfileModal={hideProfileModal}
                        myRequests={myRequests}
                        myFriends={myFriends}
                        maxRequestsToshow={maxRequestsToshow}
                        updateFriendCount={updateFriendCount}
                        fetchMoreFriends={fetchMoreFriends}
                        visible={profileModal.visible} />

                    <i className={`fa fa-arrow-circle-o-up d-none goUpArrow ${goDownArrow === true ? "d-block" : ""}`} aria-hidden="true" type="button"
                        onClick={goUp}
                    ></i>

                    <Footer />
                </div>
                : <SiteLoader />}

            {/* Modals */}
            <ReportCommentModal />
            {avatarModalReducer.visible && <AvatarSelModal uploadImage={uploadImage} />}
            {/* Modals */}
        </div>
    )
}
