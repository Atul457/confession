import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import auth from '../../behindScenes/Auth/AuthCheck';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../commonApi';
import Lightbox from "react-awesome-lightbox";
import userIcon from '../../../images/userAcc.png';
import commentCountIcon from '../../../images/commentCountIcon.svg';
import forwardIcon from '../../../images/forwardIcon.png';
import InfiniteScroll from "react-infinite-scroll-component";
import Comments from '../../pageElements/components/Comments';
import useShareKit from '../../utilities/useShareKit';
import _ from 'lodash';
import TextareaAutosize from 'react-textarea-autosize';
import shareKitIcon from "../../../images/shareKitIcon.png";
import DateConverter from '../../../helpers/DateConverter';
import { useDispatch, useSelector } from 'react-redux';
import { closeCModal, resetCModal, updateCModalState } from '../../../redux/actions/commentsModal';
import { togglemenu, toggleSharekitMenu } from '../../../redux/actions/share';
import canBeRequested from "../../../images/canBeRequested.svg";
import alRequested from "../../../images/alRequested.svg";
import upvote from '../../../images/upvote.svg';
import upvoted from '../../../images/upvoted.svg';
import alFriends from "../../../images/alFriends.svg";
import useShareRequestPopUp from '../../utilities/useShareRequestPopUp';
import { openCFRModal } from '../../../redux/actions/friendReqModal';
import { getToken } from '../../../helpers/getToken';



export default function CommentGotModal({ categories, ...rest }) {

    let maxChar = 2000;
    const dispatch = useDispatch();
    const { state } = useSelector(state => state.commentsModalReducer);
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [confessionData, setConfessionData] = useState(false);
    const [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp] = useShareRequestPopUp();
    const [sharekit, toggleSharekit, ShareKit, hideShareKit] = useShareKit();
    const [isWaitingRes, setIsWaitingRes] = useState(true);
    const [isServerErr, setIsServerErr] = useState(false);
    const [isValidPost, setIsValidPost] = useState(true);   //MEANS STATUS IS OK BUT GOT NO RES
    const [sharedBy, setSharedBy] = useState('');
    const [comment, setComment] = useState('');
    const [commentsData, setCommentsData] = useState({ page: 1 });
    const [postId, setPostId] = useState('');
    const [requiredError, setRequiredError] = useState('');
    const [commentsArr, setCommentsArr] = useState([]);
    const [lightBox, setLightBox] = useState(false);
    const [changeState, setChangeState] = useState(true);
    const [commentsCount, setCommentsCount] = useState(0);
    const [goDownArrow, setGoDownArrow] = useState(false);
    const ShareReducer = useSelector(store => store.ShareReducer);



    const _doComment = async (comment_id = false, editedComment = "") => {

        var arr, _comment, userData;

        userData = getToken();

        if (comment_id === false)       //NEW COMMENT
        {
            setRequiredError('');
            if (comment === '') {
                setRequiredError('This is required field');
                return false;
            }
            _comment = comment;
            setComment("");
            arr = {
                "confession_id": postId,
                "comment": _comment,
                "comment_id": ""
            }
        } else      //UPDATE COMMENT
        {
            _comment = editedComment;
            arr = {
                "confession_id": postId,
                "comment": _comment,
                "comment_id": comment_id
            }
        }

        let obj = {
            data: arr,
            token: userData,
            method: "post",
            url: "postcomment"
        }

        try {
            const response = await fetchData(obj)
            if (response.data.status === true) {
                let shared = sharedBy;
                setComment("");
                changeState ? setChangeState(false) : setChangeState(true);

                //APPENDS DATA ONLY WHEN YOU ARE ON THE LAST PAGE OF THE COMMENTS
                var pageSize, totalPages;
                pageSize = 20;
                totalPages = Math.ceil(commentsCount / pageSize);
                totalPages = totalPages === 0 ? (totalPages + 1) : totalPages;
                rest.handleChanges(true);

                if (totalPages === commentsData.page && comment_id === false)   //APPENDS
                {
                    var newComment, commentsArrDummy;
                    newComment = {};
                    newComment = response.data.comment;
                    commentsArrDummy = [];
                    commentsArrDummy = commentsArr;
                    commentsArrDummy.push(newComment);
                    setCommentsArr(commentsArrDummy);
                    setSharedBy(parseInt(shared) + 1);
                }
                else if (comment_id === false)  //JUST INCREMENTS THE COMMENT COUNT
                {
                    setCommentsCount(parseInt(shared) + 1);
                    setSharedBy(parseInt(shared) + 1);
                }
                else    //UPDATES
                {
                    var arr = commentsArr.map((curr) => {
                        if (curr.comment_id === comment_id) {
                            return { ...curr, "comment": _comment };
                        } else {
                            return curr;
                        }
                    });

                    setCommentsArr(arr);
                }

            } else {
                setRequiredError(response.data.message);
            }
        }
        catch {
            console.log('some error occured');
        }
    }

    const doComment = _.debounce(_doComment, 500);

    useEffect(() => {
        setConfessionData({
            confession_id: state.postId,
            category_name: state.category_name,
            created_by: state.created_by,
            created_at: state.created_at,
            description: state.description,
            no_of_comments: state.no_of_comments,
            post_as_anonymous: state.post_as_anonymous,
            profile_image: state.profile_image,
            user_id: state.user_id,
            viewcount: state.viewcount,
            image: state.image,
        });

        setSharedBy(state.no_of_comments)
        setPostId(state.postId);
        setIsValidPost(true);
        setIsWaitingRes(false);

    }, [state.postId])


    const commentsOnCconfession = async (page = 1, append = false) => {
        let pageNo = page;

        let token;
        if (auth()) {
            token = localStorage.getItem("userDetails");
            token = JSON.parse(token);
            token = token.token;
        } else {
            token = "";
        }

        let data = {
            "confession_id": state.postId,
            "page": pageNo
        }

        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "getcomments"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                if (append === true) {
                    let newConf = [...commentsArr, ...res.data.body.comments];
                    setCommentsData({ page: pageNo });
                    setCommentsArr(newConf);
                } else {
                    setCommentsCount(res.data.body.count);
                    setCommentsArr(res.data.body.comments);
                }
            }
        } catch {
            console.log("something went wrong");
        }
    }


    useEffect(() => {
        commentsOnCconfession();
    }, [state.postId])


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                doComment();
            }
        }
    }


    const fetchMoreComments = () => {
        commentsOnCconfession((commentsData.page + 1), true);
    }

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        if (document.querySelector("#postsMainCont")) {
            let scroll = document.querySelector("#postsMainCont") ?
                document.querySelector("#postsMainCont").scrollTop :
                0;
            if (scroll > 800) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        }
    }, [isValidPost])


    const goUp = () => {
        document.querySelector("#postsMainCont").scrollTo({ top: "0px", behavior: "smooth" });
    }

    //SCROLLS TO TOP
    const handleScrollTo = () => {
        let scroll = document.querySelector("#postsMainCont") ?
            document.querySelector("#postsMainCont").scrollTop :
            0;
        if (scroll > 800) {
            setGoDownArrow(true);
        } else {
            setGoDownArrow(false);
        }
    }


    const updateComment = (commentData) => {
        doComment(commentData.comment_id, commentData.comment);
    }


    const updateComments = (commentId) => {
        setCommentsCount((prevState) => prevState - 1);
        let newCommentsArr = commentsArr.filter((current) => {
            if (commentId !== current.comment_id) {
                return current;
            }
        })

        setCommentsArr(newCommentsArr);
        setSharedBy((prevState) => prevState - 1);
    }

    const closeModal = () => {
        let upvoteDownvoteData = {}, viewData, likeDislikeCheck, isViewedCheck, data;
        // CHECKS CHANGES IN UPVOTE AND DOWNVOTE
        likeDislikeCheck = state.is_liked_prev === 0 && state.is_liked_prev !== state.is_liked;
        // CHECKS WHETHER THE POST WAS UNVIEWED OR VIEWED
        isViewedCheck = state.is_viewed === 0;
        if (likeDislikeCheck === true) {
            upvoteDownvoteData = {
                like: state.like,
                dislike: state.dislike,
                is_liked: state.is_liked,
            }
        }

        if (isViewedCheck || likeDislikeCheck) {
            viewData = {
                viewcount: state.viewcount + 1,
                is_viewed: 1,
            }

            data = {
                ...(isViewedCheck && viewData),
                ...(likeDislikeCheck && upvoteDownvoteData)
            }

            // RUNS THE UPDATECONFESSIONDATA FUNCTION DEFINED IN POST.JS
            state.updateConfessionData(state.index, data);
        }
        dispatch(resetCModal())
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
                        src={profileImg !== '' ? profileImg : userIcon}
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
                        src={profileImg !== '' ? profileImg : userIcon}
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
                        src={profileImg !== '' ? profileImg : userIcon}
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


    const _toggleShareReqPopUp = (id, value) => {

        dispatch(togglemenu({
            id, value,
        }))

        dispatch(
            toggleSharekitMenu(false)
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
            toggleSharekitMenu(value)
        )
        dispatch(togglemenu({
            id, value: false
        }))

        if (shareReqPopUp) {
            closeShareReqPopUp();
        }
        toggleSharekit();

    }

    const closeShareMenu = () => {
        dispatch(togglemenu({
            id: null, value: false
        }))
    }


    const openFrReqModalFn_Post = () => {
        dispatch(openCFRModal({
            cancelReq: state.isNotFriend === 2 ? true : false,
            userId: state.user_id
        }))
        dispatch(closeCModal())
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
                url: `likedislike/${state.postId}`
            }
            try {
                data = {
                    like: isLiked ? state.like + 1 : state.like - 1,
                    is_liked: isLiked ? 1 : 2
                }
                rest.updatedConfessions(state.index, data)
                dispatch(updateCModalState(data))

                const res = await fetchData(obj)

                if (res.data.status === true) {

                } else {
                    console.log(res);
                }
            } catch (error) {
                console.log(error);
                console.log("Some error occured");
            }
        } else {
            console.log("Invalid ip");
        }
    }

    return (
        <>
            <Modal show={state.visibility} size="lg" className="commentsModal" onHide={closeModal}>
                <Modal.Header className='justify-content-between'>
                    <h6>Comments</h6>
                    <span onClick={closeModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody pt-0 commentsGot">
                    <div className="container-fluid postWrapperCommentsModal">
                        {confessionData
                            ?
                            <div className="row commentsNlightboxWrapper">
                                {lightBox && (
                                    confessionData.image && ((confessionData.image).length !== 0 && ((confessionData.image).length > 1
                                        ?
                                        (<Lightbox images={confessionData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                                        :
                                        (<Lightbox image={confessionData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                                )}
                                <div className="container py-md-4 p-1">
                                    <div className="row forPosSticky">

                                        {/* MIDDLECONTAINER */}

                                        {isWaitingRes
                                            ?
                                            <section className="col-lg-12 col-md-12 col-12 mt-3 mt-lg-0">
                                                <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </section>
                                            :
                                            (isServerErr
                                                ?
                                                (<section className="col-lg-12 col-md-8 col-12 pt-1 mt-lg-0">
                                                    <div className="alert alert-danger" role="alert">
                                                        Server Error.. Please try again
                                                    </div>
                                                </section>)
                                                :
                                                (
                                                    <section className="sharekitWrapper col-lg-12 col-md-12 col-12 mt-3 mt-lg-0 px-0 px-md-3">

                                                        <span
                                                            type="button"
                                                            className={`sharekitdots resetRightModal ${sharekit === false ? "justify-content-end" : ""}`}
                                                            onClick={() => _toggleShareReqPopUp(state.postId, ShareReducer.selectedPost?.id === state.postId ? !ShareReducer.selectedPost?.value : true)}>
                                                            {ShareReducer &&
                                                                ShareReducer.selectedPost?.id === state.postId &&
                                                                ShareReducer.sharekitShow &&
                                                                <ShareKit
                                                                    postData={{
                                                                        confession_id: state.postId,
                                                                        description: state.postedComment,
                                                                    }}
                                                                    closeShareReqPopUp={closeShareReqPopUp} />}
                                                            <img src={shareKitIcon} className="shareKitImgIcon" />
                                                        </span>

                                                        {ShareReducer &&
                                                            ShareReducer.selectedPost?.id === state.postId &&
                                                            ShareReducer.selectedPost?.value === true &&
                                                            <ShareRequestPopUp
                                                                toggleSharekit={
                                                                    () => _toggleSharekit(state.postId, !ShareReducer.sharekitShow?.value)
                                                                }
                                                                isNotFriend={state.isNotFriend}
                                                                openFrReqModalFn={openFrReqModalFn_Post}
                                                                closeShareMenu={closeShareMenu}
                                                            />}

                                                        {isValidPost ? <div className="postCont modalPostCont">
                                                            {sharekit &&
                                                                <div className="shareKitSpace"></div>}
                                                            <div className="postContHeader justify-content-start">
                                                                <span className="userImage userImageFeed">

                                                                    {ProfileIcon(state.profile_image, state.isNotFriend)}
                                                                </span>

                                                                {confessionData.post_as_anonymous === 1
                                                                    ? <span className="userName postUserName">
                                                                        {confessionData.created_by}
                                                                    </span> :
                                                                    <Link className={`textDecNone postUserName`}
                                                                        to={confessionData.post_as_anonymous === 0 &&
                                                                            (auth() ? (userDetails.profile.user_id === confessionData.user_id ? `/profile` : `/userProfile?user=${confessionData.user_id}`) : `/userProfile?user=${confessionData.user_id}`)
                                                                        }>
                                                                        <span className="userName removeElipses">
                                                                            {confessionData.post_as_anonymous === 1 ? "Anonymous ." : confessionData.created_by}
                                                                        </span>
                                                                    </Link>}


                                                                <span className="catCommentBtnCont">
                                                                    <div className="categoryOfUser" type="button">{(confessionData.category_name).charAt(0) + (confessionData.category_name).slice(1).toLowerCase()}</div>
                                                                </span>
                                                                <span className="postCreatedTime">
                                                                    {/* {confessionData.created_at} */}
                                                                    {DateConverter(confessionData.created_at)}

                                                                </span>
                                                            </div>
                                                            <div className="postBody">
                                                                <div className="postedPost">
                                                                    <pre className="preToNormal">
                                                                        {confessionData.description}
                                                                    </pre>
                                                                </div>


                                                                {(confessionData.image !== null && (confessionData.image).length > 0)
                                                                    &&
                                                                    (
                                                                        <div className="form-group imgPreviewCont my-2 mb-0">
                                                                            <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }} >
                                                                                {(confessionData.image).map((src) => {
                                                                                    return (<span className='uploadeImgWrapper fetched'>
                                                                                        <img src={src} alt="" className="previewImg" />
                                                                                    </span>)

                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )

                                                                }

                                                                {auth() === true &&
                                                                    <div className="container-fluid inputWithForwardCont">
                                                                        <div className="inputToAddComment textAreaToComment mb-1 my-md-0">
                                                                            <TextareaAutosize type="text" maxLength={maxChar} row='1' value={comment} onKeyDown={(e) => { checkKeyPressed(e) }} onChange={(e) => { setComment(e.target.value) }} className="form-control mt-0 mb-2"></TextareaAutosize>

                                                                        </div>
                                                                        <div className="arrowToAddComment" type="button" id="commentsModalDoComment" onClick={() => { doComment() }}>
                                                                            <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <span className="d-block text-left errorCont text-danger mb-2 moveUp">{requiredError}</span>
                                                            </div>

                                                            <div className="postFoot commmentsGotModal">

                                                                {auth() === false &&
                                                                    <span className="feedPageLoginBtnCont postLoginBtnCont">
                                                                        <Link to="/login">
                                                                            <div className="categoryOfUser enhancedStyle" type="button">
                                                                                Login to comment
                                                                            </div>
                                                                        </Link>
                                                                    </span>}

                                                                <div className={`iconsCont ${auth() === false ? 'mainDesignOnWrap' : ''}`}>
                                                                    <div className="upvote_downvote_icons_cont  ml-0" type="button">
                                                                        <img src={commentCountIcon} alt="" />
                                                                        <span className="count">
                                                                            {state.no_of_comments}
                                                                        </span>
                                                                    </div>


                                                                    {(state.hasOwnProperty("is_liked")
                                                                        ?
                                                                        <div className='iconsMainCont'>
                                                                            <div className={`upvote_downvote_icons_cont buttonType`}>
                                                                                {state.is_liked === 1 ?
                                                                                    <img src={upvoted} alt="" onClick={() => upvoteOrDownvote(false)} /> :
                                                                                    <img src={upvote} alt="" onClick={() => upvoteOrDownvote(true)} />}
                                                                                <span className='count'>{state.like}</span>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div className='iconsMainCont'>
                                                                            <div className={`upvote_downvote_icons_cont`}>
                                                                                <img src={upvote} alt="" />
                                                                                <span className='count'>{state.like}</span>
                                                                            </div>
                                                                        </div>)}

                                                                </div>
                                                            </div>
                                                        </div>
                                                            :
                                                            <div className="alert alert-danger" role="alert">
                                                                The post doesn't exists
                                                            </div>}

                                                        {isValidPost && <div className="postsMainCont" id="postsMainCont">
                                                            {commentsArr.length > 0
                                                                ?
                                                                <InfiniteScroll
                                                                    onScroll={handleScrollTo}
                                                                    className="commentsModalIscroll"
                                                                    scrollableTarget="postsMainCont"
                                                                    endMessage={
                                                                        <div className="endListMessage mt-2 pb-0">
                                                                            End of Comments,
                                                                            <span
                                                                                className='closeBackButton'
                                                                                onClick={closeModal}>
                                                                                Go back
                                                                            </span>
                                                                        </div>
                                                                    }
                                                                    dataLength={commentsArr.length}
                                                                    next={fetchMoreComments}
                                                                    hasMore={commentsArr.length < commentsCount}
                                                                    loader={
                                                                        <div className="w-100 text-center">
                                                                            <div className="spinner-border pColor mt-4" role="status">
                                                                                <span className="sr-only">Loading...</span>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                >
                                                                    {commentsArr.map((post, index) => {
                                                                        return <Comments
                                                                            updateComments={updateComments}
                                                                            postId={postId}
                                                                            updateComment={updateComment}
                                                                            created_at={post.created_at}
                                                                            commentId={post.comment_id}
                                                                            countChild={post.countChild}
                                                                            is_editable={post.is_editable}
                                                                            curid={(post.user_id === '' || post.user_id === 0) ? false : post.user_id}
                                                                            key={"Arr" + index + postId + "dp"}
                                                                            imgUrl={post.profile_image}
                                                                            userName={post.comment_by}
                                                                            postedComment={post.comment} />

                                                                    })}
                                                                </InfiniteScroll>
                                                                : <div className="endListMessage m-0 pb-1">End of Comments,
                                                                    <span
                                                                        className='closeBackButton'
                                                                        onClick={closeModal}>
                                                                        Go back
                                                                    </span>
                                                                </div>}

                                                        </div>}

                                                    </section>
                                                )
                                            )}

                                        {/* MIDDLECONTAINER */}
                                    </div>
                                </div>
                                <i className={`fa fa-arrow-circle-o-up commentsModalGoUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
                            </div>
                            :
                            <div className="w-100 text-center d-none">
                                <div className="spinner-border pColor mt-4" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        }

                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
