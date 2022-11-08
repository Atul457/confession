import React, { useState } from 'react';
import { Link } from "react-router-dom";
import auth from '../behindScenes/Auth/AuthCheck';
import userIcon from '../../images/userAcc.png';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { fetchData } from '../../commonApi';
import forwardIcon from '../../images/forwardIcon.svg';
import SetAuth from '../behindScenes/Auth/SetAuth';
import { useNavigate } from "react-router-dom";
import useShareKit from '../utilities/useShareKit';
import TextareaAutosize from 'react-textarea-autosize';
import DateConverter from '../../helpers/DateConverter';
import { useDispatch } from 'react-redux';
import viewsCountIcon from '../../images/viewsCountIcon.svg';
import commentCountIcon from '../../images/commentCountIcon.svg';
import upvote from '../../images/upvote.svg';
// import upvoted from '../../images/upvoted.svg';
import { openCModal as openCommentsModalFn } from '../../redux/actions/commentsModal';


export default function Post(props) {

    let maxChar = 2000;
    let history = useNavigate();
    const post = props?.post ?? {}
    const dispatch = useDispatch();
    const noOfWords = useState(200);    //IN POST AFTER THESE MUCH CHARACTERS SHOWS VIEWMORE BUTTON
    const [requiredError, setRequiredError] = useState('');

    const [confessionData] = useState({
        confession_id: props.postId,
        description: props.postedComment,
    });
    const [comment, setComment] = useState('');
    const [lightBox, setLightBox] = useState(false);
    const [adminDetails] = useState(auth() ? JSON.parse(localStorage.getItem("adminDetails")) : '');
    const [deleteConfession, setDeleteConfession] = useState(false);
    const isCoverTypePost = props.category_id === 0
    const postBg = isCoverTypePost ? {
        backgroundImage: `url('${props?.cover_image}')`,
        name: "post"
    } : {}

    // CUSTOM HOOKS
    const [sharekit, toggleSharekit, ShareKit] = useShareKit();

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
            "cover_image": props.cover_image,
            ...(props.is_liked !== undefined && { "is_liked": props.is_liked }),
            "is_liked_prev": props.is_liked,
            "updateConfessionData": updateConfessionData
        }))
    }

    // DELETE CONFESSION
    const deleteConfessionFunc = async () => {
        let confirmation = window.confirm("Do you really want to delete the Confession ?");
        if (confirmation === true) {
            setDeleteConfession(true);

            let obj = {
                data: {},
                token: adminDetails.token,
                method: "get",
                url: `admin/deleteconfession/${props.postId}`
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    props.updateConfessions(props.postId);  //UPDATE CONFESSIONS 
                }
                setDeleteConfession(false);
            } catch {
                console.log("Some error occured");
                setDeleteConfession(false);
            }
        }
    }

    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#postDoComment');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }

    //DO COMMENT
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

        let userData = localStorage.getItem("adminDetails");
        if (userData === "" || userData === null) {
            SetAuth(0);
            history("/talkplacepanel");
        }
        userData = JSON.parse(userData).token;
        let arr = {
            "confession_id": postId,
            "comment": _comment,
            "is_admin": 1
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
        } catch {
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

    const updateConfessionData = (index, data) => {
        props.updatedConfessions(index, data)
    }


    const checkKeyPressed = betterCheckKeyPressed();


    return (
        <div className="postCont admin" index={props.index}>

            <span type="button" className={`sharekitdots withBg ${sharekit === false ? "justify-content-end" : ""}`} onClick={toggleSharekit}>
                {sharekit && <ShareKit postData={{
                    confession_id: props.postId,
                    description: props.postedComment,
                }} />}
                <i className="fa fa-share-alt" aria-hidden="true"></i>
            </span>


            <i className="fa fa-trash pr-3 deletePostIcon" type="button" aria-hidden="true" onClick={deleteConfessionFunc}></i>
            {/* </span> */}

            {sharekit &&
                <div className="shareKitSpace"></div>}

            <div className="postContHeader justifyContentInitial">
                {lightBox && (
                    props.imgUrl && ((props.imgUrl).length !== 0 && ((props.imgUrl).length > 1
                        ?
                        (<Lightbox images={props.imgUrl} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                        :
                        (<Lightbox image={props.imgUrl} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                )}
                <span className="userImage userImageFeed">
                    <img src={props.profileImg !== '' ? props.profileImg : userIcon} className="userAccIcon" alt="" />
                </span>


                {/* NOT ANONYMOUS :: OPENS CURRENT LOGGED IN USER'S PROFILE,
                IF THE POST IS POSTED BY THE LOGGED IN USER, AND HE HAD NOT POSTED THE POST AS ANONYMOUS,
                ELSE THIS WILL OPEN THE PROFILE OF THE USER, WHO HAVE POSTED THE POST, NOT AS ANONYMOUS
                    
                ANONYMOUS :: WILL NOT DO ANY THING
                */}
                <Link className={`textDecNone postUserName`}
                    to="#"
                >
                    <span className="userName">
                        {props.userName}
                    </span>
                </Link>

                {!isCoverTypePost && <span className="catCommentBtnCont">
                    <div className="categoryOfUser">{(props.category).charAt(0) + (props.category).slice(1).toLowerCase()}</div>
                </span>}

                <span className={`postCreatedTime`}>
                    {DateConverter(props.createdAt)}
                </span>
            </div>


            <div
                className={`postBody ${isCoverTypePost ? 'coverTypePost' : ''}`}
                style={postBg}>
                <Link className="links text-dark" to={`/dashboard/confession/${props?.slug}`}>
                    <div className="postedPost pb-1">
                        <pre
                            {...(!isCoverTypePost && { onClick: openCommentsModal })}
                            className="preToNormal post">
                            {props.postedComment}
                        </pre>
                        {
                            ((props.postedComment).split("")).length >= noOfWords[0]
                                ||
                                (props.postedComment).split("\n").length > 5 ?
                                <>
                                    {((props.postedComment).split("")).length >= noOfWords[0] && (props.postedComment).split("\n").length < 5 && <span className='ellipsesStyle'>... </span>}<span toberedirectedto={props.postId} onClick={openCommentsModal} className="viewMoreBtn pl-1">view more</span>
                                </> : ''
                        }
                    </div>
                </Link>

                {/* IF IMG URL WILL BE STRING THEN IMAGES WILL NOT BE SHOWN */}
                {(props.imgUrl !== null && (props.imgUrl).length > 0 && typeof (props.imgUrl) !== 'string')
                    &&
                    <div className="form-group imgPreviewCont mt-2 mb-0">
                        <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }}>
                            {(props.imgUrl).map((srcg, index) => {
                                return <span className="uploadeImgWrapper fetched" key={`uploadeImgWrapper${index}`}>
                                    <img key={"srcg" + index} src={srcg} alt="" className='previewImg' />
                                </span>
                            })}
                        </div>
                    </div>
                }
            </div>

            {/* Comment field */}

            <div className="container-fluid inputWithForwardCont">
                <div className="inputToAddComment textAreaToComment w-100">
                    <TextareaAutosize
                        type="text"
                        maxLength={maxChar}
                        row='1'
                        value={comment}
                        onKeyDown={(e) => { checkKeyPressed(e) }}
                        onChange={(e) => { setComment(e.target.value) }}
                        className="form-control mb-3 mt-2">
                    </TextareaAutosize>
                </div>
                <div className="arrowToAddComment" id="postDoComment" type="button" onClick={() => { doComment(props.postId) }}>
                    <img src={forwardIcon} alt="" className="forwardIconContImg" />
                </div>
            </div>
            <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>



            <div className="postFoot">
                <div className={`iconsCont`}>
                    <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button" onClick={openCommentsModal}>
                        <img src={viewsCountIcon} alt="" />
                        <span className="count">{props.viewcount ? props.viewcount : 0}</span>
                    </div>
                    <div className="upvote_downvote_icons_cont" type="button" onClick={openCommentsModal}>
                        <img src={commentCountIcon} alt="" />
                        <span className="count">{props.sharedBy}</span>
                    </div>

                    <div className='iconsMainCont'>
                        <div className={`upvote_downvote_icons_cont`}>
                            <img src={upvote} alt="" />
                            <span className='count'>{props.like}</span>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
}
