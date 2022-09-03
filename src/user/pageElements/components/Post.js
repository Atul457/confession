
import React, { useState } from 'react';
import forwardIcon from '../../../images/forwardIcon.svg';
import upvote from '../../../images/upvote.svg';
import commentCountIcon from '../../../images/commentCountIcon.svg';
import viewsCountIcon from '../../../images/viewsCountIcon.svg';
import upvoted from '../../../images/upvoted.svg';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/SetAuth';
import userIcon from '../../../images/userAcc.svg';
import { useNavigate } from "react-router-dom";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { fetchData } from '../../../commonApi';
import useShareKit from '../../utilities/useShareKit';
import TextareaAutosize from 'react-textarea-autosize';
import shareKitIcon from "../../../images/shareKitIcon.png";
import canBeRequested from "../../../images/canBeRequested.svg";
import alRequested from "../../../images/alRequested.svg";
import alFriends from "../../../images/alFriends.svg";
import useShareRequestPopUp from '../../utilities/useShareRequestPopUp';
import { useDispatch, useSelector } from 'react-redux';
import { togglemenu, toggleSharekitMenu } from '../../../redux/actions/share';
import DateConverter from '../../../helpers/DateConverter';
import { openCModal as openCommentsModalFn } from '../../../redux/actions/commentsModal';
import { openCFRModal } from '../../../redux/actions/friendReqModal';




export default function Post(props) {

    let history = useNavigate();
    let maxChar = 2000;
    const dispatch = useDispatch();
    const ShareReducer = useSelector(store => store.ShareReducer);
    const [requiredError, setRequiredError] = useState('');
    const friendReqState = useSelector(state => state.friendReqModalReducer)
    const authenticated = useState(auth());
    const noOfWords = useState(200);    //IN POST AFTER THESE MUCH CHARACTERS SHOWS VIEWMORE BUTTON
    const [comment, setComment] = useState('');
    const [lightBox, setLightBox] = useState(false);
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');

    // CUSTOM HOOKS
    const [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp] = useShareRequestPopUp();
    const [sharekit, toggleSharekit, ShareKit, hideShareKit] = useShareKit();

    const openCommentsModal = () => {
        dispatch(openCommentsModalFn({
            "postId": props.postId,
            "viewcount": props.viewcount,
            "visibility": true,
            "index": props.index,
            "userName": props.userName,
            "postedComment": props.postedComment,
            "category_id": props.category_id,
            "category_name": props.category,
            "confession_id": props.confession_id,
            "created_at": props.createdAt,
            "created_by": props.userName,
            "description": props.postedComment,
            "no_of_comments": props.sharedBy,
            "post_as_anonymous": props.post_as_anonymous,
            "profile_image": props.profileImg,
            "user_id": props.curid,
            "image": props.imgUrl,
            "isNotFriend": props.isNotFriend,
            "is_viewed": props.is_viewed,
            "updatedConfessions": props.updatedConfessions,
            "like": props.like,
            "dislike": props.dislike,
            ...(props.is_liked !== undefined && { "is_liked": props.is_liked }),
            "is_liked_prev": props.is_liked,
            "updateConfessionData": updateConfessionData
        }))

        dispatch(togglemenu({
            id: null, value: false, isPost: true
        }))
    }

    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#userPostCommentIcon');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }

    const doComment = async (postId) => {
        setRequiredError('');
        preventDoubleClick(true);

        if (comment.trim() === '') {
            setRequiredError('This field is required');
            setComment('');
            preventDoubleClick(false);
            return false;
        }
        let _comment = comment;
        setComment("");
        let userData = localStorage.getItem("userDetails");
        if (userData === "" || userData === null) {
            SetAuth(0);
            history("/login");
        }

        userData = JSON.parse(userData).token;
        let arr = {
            "confession_id": postId,
            "comment": _comment,
            "is_admin": 0
        }


        let obj = {
            data: arr,
            token: userData,
            method: "post",
            url: "postcomment"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                setComment("");
                props.updateConfessionData(props.viewcount, (props.sharedBy + 1), props.index);
            } else {
                setRequiredError(res.data.message);
            }
        } catch (error) {
            console.log(error);
            console.log("Some error occured");
        }
        preventDoubleClick(false);

    }


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const betterCheckKeyPressed = () => {
        var timer;
        return (event) => {
            if (window.innerWidth > 767) {
                if (event.keyCode === 13 && event.shiftKey) {
                    setComment(comment);
                } else if (event.keyCode === 13 && !event.shiftKey) {
                    event.preventDefault();
                    //PREVENTS DOUBLE MESSAGE SEND
                    clearInterval(timer);
                    timer = setTimeout(() => {
                        doComment(props.postId);
                    }, 100);
                }
            }
        }
    }

    const deletePost = () => {
        props.deletePostModal(props.postId, props.index);
    }

    const checkKeyPressed = betterCheckKeyPressed();

    const _toggleShareReqPopUp = (id, value) => {

        dispatch(togglemenu({
            id, value, "isPost": true
        }))

        dispatch(
            toggleSharekitMenu(false, true)
        )

        if (sharekit) {
            hideShareKit();
        } else {
            toggleShareReqPopUp();

            if (shareReqPopUp === true) {
                hideShareKit();
            }
        }

    }

    const _toggleSharekit = (id, value) => {
        dispatch(
            toggleSharekitMenu(value, true)
        )
        dispatch(togglemenu({
            id, value: false, isPost: true
        }))

        if (shareReqPopUp) {
            closeShareReqPopUp();
        }
        toggleSharekit();
    }

    const openFrReqModalFn_Post = () => {
        dispatch(openCFRModal({
            cancelReq: props.isNotFriend === 2 ? true : false,
            userId: (friendReqState.requested === true || friendReqState.cancelled) ?
                friendReqState.data.userId :
                props.curid
        }))

        // other === requested
        // 2 === cancel the requst

        // openFrReqModalFn();
        dispatch(togglemenu({
            id: null, value: false, isPost: true
        }))

        dispatch(
            toggleSharekitMenu(false, true)
        )
        toggleShareReqPopUp();
        hideShareKit();
    }


    const closeShareMenu = () => {
        dispatch(togglemenu({
            id: null, value: false, isPost: false
        }))
    }

    const ProfileIcon = (profileImg, isNotFriend) => {

        // isNotFriend :
        // 0 : SHOW NOTHING
        // 1 : SHOW REQUEST
        // 2: SHOW CANCEL 
        // 3: ALREADY FRIEND

        let profileImage, profileBPlate;

        profileImage = profileImg !== '' ? profileImg : userIcon;

        const getHtml = () => {

            if (isNotFriend === 1) {
                return <>
                    <img
                        src={canBeRequested}
                        type="button"
                        alt=""
                        onClick={openFrReqModalFn_Post}
                        className='registeredUserIndicator' />
                    <img
                        src={props.profileImg !== '' ? props.profileImg : userIcon}
                        className="userAccIcon generated"
                        onClick={openFrReqModalFn_Post}
                        alt=""
                    />
                </>
            }

            if (isNotFriend === 2) {
                return <>
                    <img
                        src={alFriends}
                        onClick={openFrReqModalFn_Post}
                        type="button"
                        alt=""
                        className='registeredUserIndicator' />
                    <img
                        src={props.profileImg !== '' ? props.profileImg : userIcon}
                        onClick={openFrReqModalFn_Post}
                        className="userAccIcon"
                        alt=""
                    />
                </>
            }

            if (isNotFriend === 3) {
                return <>
                    <img
                        src={alRequested}
                        type="button"
                        alt=""
                        className='registeredUserIndicator' />
                    <img
                        src={props.profileImg !== '' ? props.profileImg : userIcon}
                        className="userAccIcon"
                        alt=""
                    />
                </>
            }

            return <img src={profileImage} className="userAccIcon" alt="" />
        }


        profileBPlate = getHtml();
        return profileBPlate;
    }


    const visitePrevilage = (creatorId, isAnonymous) => {
        let isMyProfile = false;
        let isUserProfile = false;
        let isMyPost = false;
        let linkToVisit = "#";
        let html = "";

        if (auth()) {
            isMyPost = userDetails.profile.user_id === creatorId
        }

        isMyProfile = isMyPost && isAnonymous === 0;
        isUserProfile = creatorId && isAnonymous === 0 && !isMyPost;

        if (isMyProfile)
            linkToVisit = "/profile"
        if (isUserProfile)
            linkToVisit = `/userProfile/${creatorId}`

        html = <Link className={`textDecNone postUserName`}
            to={linkToVisit}>
            <span className="userName">
                {props.userName}
            </span>
        </Link>

        return html;
    }


    const upvoteOrDownvote = async (isLiked) => {

        let is_liked, ip_address, check_ip, token = '', data;
        is_liked = isLiked ? 1 : 2;
        ip_address = localStorage.getItem("ip")
        check_ip = ip_address.split(".").length
        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = JSON.parse(token).token;
        }

        if (check_ip === 4) {
            let obj = {
                data: { is_liked, ip_address },
                token: token,
                method: "post",
                url: `likedislike/${props.postId}`
            }
            try {
                data = {
                    like: isLiked ? props.like + 1 : props.like - 1,
                    is_liked: isLiked ? 1 : 2
                }
                updateConfessionData(props.index, data)

                const res = await fetchData(obj)
            } catch (error) {
                console.log(error);
                console.log("Some error occured");
            }
        } else {
            console.log("Invalid ip");
        }
    }

    const updateConfessionData = (index, data) => {
        props.updatedConfessions(index, data)
    }


    return (
        <div className="postCont" index={props.index}>

            {ShareReducer &&
                ShareReducer.selectedPost?.id === props.postId &&
                ShareReducer.sharekitShow &&
                <div className="shareKitSpace"></div>}

            <span
                type="button"
                className={`sharekitdots ${sharekit === false ? "justify-content-end" : ""} ${!props.deletable ? "resetRight" : ""}`}
                onClick={() => _toggleShareReqPopUp(props.postId, ShareReducer.selectedPost?.id === props.postId ? !ShareReducer.selectedPost?.value : true)}>
                {ShareReducer &&
                    ShareReducer.selectedPost?.id === props.postId &&
                    ShareReducer.selectedPost?.isPost === true &&
                    ShareReducer.sharekitShow &&
                    <ShareKit
                        postData={{
                            confession_id: props.slug,
                            description: props.postedComment,
                        }}
                        closeShareReqPopUp={closeShareReqPopUp} />}
                <img src={shareKitIcon} className="shareKitImgIcon" />
            </span>

            {/* SHARE/REQUEST POPUP */}

            {ShareReducer &&
                ShareReducer.selectedPost?.id === props.postId &&
                ShareReducer.selectedPost?.value === true &&
                ShareReducer.selectedPost?.isPost === true &&
                <ShareRequestPopUp
                    toggleSharekit={
                        () => _toggleSharekit(props.postId, !ShareReducer.sharekitShow?.value)
                    }
                    isNotFriend={props.isNotFriend}
                    openFrReqModalFn={openFrReqModalFn_Post}
                    closeShareMenu={closeShareMenu}
                />}

            {/*
                CANCELREQ :
                0 : SHOW NOTHING
                1 : SHOW REQUEST
                2: SHOW CANCEL 
                3: ALREADY FRIEND
            */}

            {/* IF POST IS DELETABLE THE DELETE ICON WILL BE SHOWN */}
            {props.deletable === true && <i className="fa fa-trash pr-3 deletePostIcon" type="button" aria-hidden="true" onClick={deletePost}></i>}


            <div className="postContHeader">
                {lightBox && (
                    props.imgUrl && ((props.imgUrl).length !== 0 && ((props.imgUrl).length > 1
                        ?
                        (<Lightbox images={props.imgUrl} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                        :
                        (<Lightbox image={props.imgUrl} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                )}

                <span className="leftContofPostCont">
                    <span className="userImage userImageFeed">
                        {ProfileIcon(props.profileImg, props.isNotFriend)}
                    </span>


                    {/* NOT ANONYMOUS :: OPENS CURRENT LOGGED IN USER'S PROFILE,
                IF THE POST IS POSTED BY THE LOGGED IN USER, AND HE HAD NOT POSTED THE POST AS ANONYMOUS,
                ELSE THIS WILL OPEN THE PROFILE OF THE USER, WHO HAVE POSTED THE POST, NOT AS ANONYMOUS
                    
                ANONYMOUS :: WILL NOT DO ANY THING
                */}
                    {visitePrevilage(props.curid, props.post_as_anonymous)}

                    {/* {props.isRegistered === 1 ?
                        <span className='registeredUserIcon'>
                            <img src={registeredUser} alt="" />
                        </span>
                        : ""} */}

                    <span className="catCommentBtnCont">
                        <div className="categoryOfUser">{(props.category).charAt(0) + (props.category).slice(1).toLowerCase()}</div>
                    </span>

                    <span className="postCreatedTime">
                        {DateConverter(props.createdAt)}
                    </span>

                </span>

                {/* SHOWS UNREAD COMMENTS ON POST */}
                {
                    (props.unread_comments && props.unread_comments !== 0) ?
                        <span className="unreadPostCommentCount">
                            {props.unread_comments} New Replies
                        </span>
                        : ''}
            </div>


            <div className="postBody">
                <div className="postedPost mb-2" onClick={openCommentsModal}>
                    <Link className="links text-dark" to="#">
                        <pre className="preToNormal post">
                            {props.postedComment}
                        </pre>
                        {
                            ((props.postedComment).split("")).length >= noOfWords[0]
                                ||
                                (props.postedComment).split("\n").length > 5 ?
                                <>
                                    {((props.postedComment).split("")).length >= noOfWords[0] && (props.postedComment).split("\n").length < 5 && <span className='ellipsesStyle'>... </span>}<span toberedirectedto={props.postId} className="viewMoreBtn pl-1">view more</span>
                                </> : ''
                        }
                    </Link>
                </div>

                {/* IF IMG URL WILL BE STRING THEN IMAGES WILL NOT BE SHOWN */}
                {(props.imgUrl !== null && (props.imgUrl).length > 0 && typeof (props.imgUrl) !== 'string')
                    &&
                    <div className="form-group imgPreviewCont mt-2 mb-0">
                        <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }}>
                            {(props.imgUrl).map((srcg, index) => {

                                return (
                                    <span className="uploadeImgWrapper fetched" key={`uploadeImgWrapper${index}`}>
                                        <img key={"srcg" + index} src={srcg} alt="" className='previewImg' />
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                }

            </div>


            {authenticated[0] === true &&
                (
                    <>
                        <div className="container-fluid inputWithForwardCont">
                            <div className="textAreaToComment w-100">
                                <TextareaAutosize
                                    type="text"
                                    maxLength={maxChar}
                                    row='1'
                                    value={comment}
                                    onKeyDown={(e) => { checkKeyPressed(e) }}
                                    onChange={(e) => { setComment(e.target.value) }}
                                    className="form-control">
                                </TextareaAutosize>
                            </div>
                            <div className="arrowToAddComment" id="userPostCommentIcon" type="button" onClick={() => { doComment(props.postId) }}>
                                <img src={forwardIcon} alt="" className="forwardIconContImg" />
                            </div>
                        </div>
                        <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>
                    </>
                )
            }


            <div className="postFoot">

                {authenticated[0] === false &&
                    <span className="feedPageLoginBtnCont postLoginBtnCont">
                        <Link to="/login">
                            <div className="categoryOfUser enhancedStyle mb-0" type="button">
                                Login to comment
                            </div>
                        </Link>
                    </span>}

                <div className={`iconsCont ${authenticated[0] === false ? 'mainDesignOnWrap' : ''}`}>
                    <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button" onClick={openCommentsModal}>
                        <img src={viewsCountIcon} alt="" />
                        <span className="count">{props.viewcount ? props.viewcount : 0}</span>
                    </div>
                    <div className="upvote_downvote_icons_cont" type="button" onClick={openCommentsModal}>
                        <img src={commentCountIcon} alt="" />
                        <span className="count">{props.sharedBy}</span>
                    </div>

                    {(props.hasOwnProperty("is_liked")
                        ?
                        <div className='iconsMainCont'>
                            <div className={`upvote_downvote_icons_cont buttonType`}>
                                {props.is_liked === 1 ?
                                    <img src={upvoted} alt="" onClick={() => upvoteOrDownvote(false)} /> :
                                    <img src={upvote} alt="" onClick={() => upvoteOrDownvote(true)} />}
                                <span className='count'>{props.like}</span>
                            </div>
                        </div>
                        :
                        <div className='iconsMainCont'>
                            <div className={`upvote_downvote_icons_cont`}>
                                <img src={upvote} alt="" />
                                <span className='count'>{props.like}</span>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>

        </div>
    )
}
