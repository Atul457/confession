import React, { useState, useEffect } from 'react';
import commentCountIcon from '../../../images/commentCountIcon.svg';
import upvote from '../../../images/upvote.svg';
import upvoted from '../../../images/upvoted.svg';
import { Modal } from 'react-bootstrap';
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/Auth/SetAuth';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../commonApi';
import Lightbox from "react-awesome-lightbox";
import userIcon from '../../../images/userAcc.png';
import forwardIcon from '../../../images/forwardIcon.svg';
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from '../../pageElements/common/Footer';
import Comments from '../Comments';
import useShareKit from '../../utilities/useShareKit';
import TextareaAutosize from 'react-textarea-autosize';
import DateConverter from '../../../helpers/DateConverter';
import { useDispatch, useSelector } from 'react-redux';
import { resetCModal, updateCModalState } from '../../../redux/actions/commentsModal';




export default function CommentGotModal({ categories, ...rest }) {


    const handleCommentsModal = () => {
        //ON THE BASIS OF THIS ID THE POST DATA RELATED TO THIS MODAL POST WILL BE CHANGED
        rest.updateConfessionData((state.viewcount + 1), sharedBy, state.index);
        var data = {
            "postId": null,
            "visibility": false,
            "index": state.index,
            "viewcount": (state.viewcount + 1)
        }
        rest.handleCommentsModal(data);
    }

    let history = useNavigate();
    const { state } = useSelector(state => state.commentsModalReducer);
    let maxChar = 2000;
    const dispatch = useDispatch();
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("adminDetails")) : '');
    const [confessionData, setConfessionData] = useState(false);
    const [sharekit, toggleSharekit, ShareKit] = useShareKit();
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
    const [commentsCount, setCommentsCount] = useState(0);
    const [goDownArrow, setGoDownArrow] = useState(false);

    const updateComments = (commentId) => {
        setCommentsCount((prevState) => prevState - 1);
        let newCommentsArr = commentsArr.filter((current) => {
            if (commentId !== current.comment_id) {
                return current;
            }
        })

        setCommentsArr(newCommentsArr);
        setSharedBy((prevState) => prevState - 1);
        dispatch(updateCModalState({ no_of_comments: parseInt(state.no_of_comments) - 1 }))
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

        viewData = {
            viewcount: state.viewcount + 1,
            is_viewed: 1,
        }

        data = {
            ...(isViewedCheck && viewData),
            ...(likeDislikeCheck && upvoteDownvoteData),
            no_of_comments: state.no_of_comments
        }

        // RUNS THE UPDATECONFESSIONDATA FUNCTION DEFINED IN POST.JS
        state.updateConfessionData(state.index, data);

        dispatch(resetCModal())
    }


    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#commentsModalDoCommentAd');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }

    const doComment = async () => {
        preventDoubleClick(true);
        setRequiredError('');

        if (comment === '') {
            setRequiredError('This is required field');
            preventDoubleClick(false);
            return false;
        }

        let _comment = comment;
        setComment("");

        let userData = localStorage.getItem("adminDetails");
        if (userData === "" || userData === null) {
            SetAuth(0);
            history("/login");
            return false;
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
            const response = await fetchData(obj)
            if (response.data.status === true) {
                let shared = sharedBy;
                setSharedBy(parseInt(shared) + 1);
                setComment("");

                //APPENDS DATA ONLY WHEN YOU ARE ON THE LAST PAGE OF THE COMMENTS
                var pageSize, totalPages;
                pageSize = 20;
                totalPages = Math.ceil(commentsCount / pageSize);
                totalPages = totalPages === 0 ? (totalPages + 1) : totalPages;
                rest.handleChanges(true);

                if (totalPages === commentsData.page) {
                    var newComment, commentsArrDummy;
                    newComment = {};
                    newComment = response.data.comment;
                    commentsArrDummy = [];
                    commentsArrDummy = commentsArr;
                    commentsArrDummy.push(newComment);
                    setCommentsArr(commentsArrDummy);
                    dispatch(updateCModalState({ no_of_comments: parseInt(state.no_of_comments) + 1 }))
                }
                setCommentsCount(parseInt(shared) + 1);

            } else {
                setRequiredError(response.data.message);
            }
        }
        catch {
            console.log('some error occured');
        }

        preventDoubleClick(false);
    }


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

        setPostId(state.postId);
        setIsValidPost(true);
        setIsWaitingRes(false);

    }, [state.postId])


    const changeListener = () => {
        rest.handleChanges(true);
    }


    const commentsOnCconfession = async (page = 1, append = false) => {
        let pageNo = page;

        let token;
        if (auth()) {
            token = localStorage.getItem("adminDetails");
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
            token: "",
            method: "post",
            url: "getcomments"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                if (append === true) {
                    let newConf = [...commentsArr, ...res.data.body.comments];
                    setCommentsData({ page: pageNo })
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
                        doComment(state.postId);
                    }, 100);
                }
            }
        }
    }

    const checkKeyPressed = betterCheckKeyPressed();


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


    const updateSingleCommentData = (data, index) => {
        let updatedNode, originalArray;
        originalArray = [...commentsArr];
        updatedNode = {};
        updatedNode = { ...updatedNode, ...commentsArr[index], ...data };
        originalArray.splice(index, 1, updatedNode);
        setCommentsArr(originalArray);
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

                                                        <span type="button" className={`sharekitdots ${sharekit === false ? "justify-content-end" : ""} resetRightModal`} onClick={toggleSharekit}>
                                                            {sharekit && <ShareKit postData={confessionData} />}
                                                            <i className="fa fa-share-alt" aria-hidden="true"></i></span>

                                                        {isValidPost ? <div className="postCont modalPostCont">
                                                            {sharekit &&
                                                                <div className="shareKitSpace"></div>}
                                                            <div className="postContHeader justify-content-start">
                                                                <span className="userImage userImageFeed">
                                                                    <img src={confessionData.profile_image === '' ? userIcon : confessionData.profile_image} className="userAccIcon" alt="" />
                                                                </span>

                                                                {confessionData.post_as_anonymous === 1
                                                                    ? <span className="userName postUserName">
                                                                        {confessionData.created_by}
                                                                    </span> :
                                                                    <Link className={`textDecNone postUserName`}
                                                                        to="#"
                                                                    >
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


                                                                {auth()
                                                                    ?
                                                                    <div className="container-fluid inputWithForwardCont">
                                                                        <div className="inputToAddComment textAreaToComment mb-1 my-md-0">
                                                                            <TextareaAutosize type="text" maxLength={maxChar} row='1' value={comment} onKeyDown={(e) => { checkKeyPressed(e) }} onChange={(e) => { setComment(e.target.value) }} className="form-control"></TextareaAutosize>

                                                                        </div>
                                                                        <div className="arrowToAddComment" type="button" id="commentsModalDoCommentAd" onClick={() => { doComment(state.postId) }}>
                                                                            <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <span className="feedPageLoginBtnCont">
                                                                        <Link to="/login">
                                                                            <div className="categoryOfUser enhancedStyle" type="button">
                                                                                Login to comment
                                                                            </div>
                                                                        </Link>
                                                                    </span>
                                                                }
                                                                <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>
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
                                                                            <div className={`upvote_downvote_icons_cont`}>
                                                                                <img src={upvote} alt="" />
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
                                                                    className='commentsModalIscroll'
                                                                    onScroll={handleScrollTo}
                                                                    scrollableTarget="postsMainCont"
                                                                    endMessage={
                                                                        <div className="endListMessage mt-2 pb-0">
                                                                            End of Comments,
                                                                            <span
                                                                                className='closeBackButton'
                                                                                onClick={closeModal}>
                                                                                Go back
                                                                            </span>
                                                                        </div>}
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
                                                                            isLastIndex={commentsArr.length === index + 1}
                                                                            index={index}
                                                                            updateSingleCommentData={updateSingleCommentData}
                                                                            changeListener={changeListener}
                                                                            countChild={post.countChild}
                                                                            commentId={post.comment_id}
                                                                            updateComments={updateComments}
                                                                            comment_id={post.comment_id}
                                                                            postId={state.postId}
                                                                            created_at={post.created_at}
                                                                            curid={(post.user_id === '' || post.user_id === 0) ? false : post.user_id}
                                                                            key={"Arr" + index + "dp"}
                                                                            imgUrl={post.profile_image} userName={post.comment_by}
                                                                            postedComment={post.comment} />

                                                                    })}
                                                                </InfiniteScroll>
                                                                : <div className="endListMessage m-0 pb-1">
                                                                    End of Comments,
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
                                <Footer />
                            </div>
                            :
                            <div className="w-100 text-center d-none">
                                <div className="spinner-border pColor mt-4" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>}

                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
