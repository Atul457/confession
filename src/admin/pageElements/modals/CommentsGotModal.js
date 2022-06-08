import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import auth from '../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../behindScenes/Auth/SetAuth';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData } from '../../../commonApi';
import Lightbox from "react-awesome-lightbox";
import userIcon from '../../../images/userAcc.png';
import forwardIcon from '../../../images/forwardIcon.png';
import InfiniteScroll from "react-infinite-scroll-component";
import Footer from '../../pageElements/common/Footer';
import Comments from '../Comments';
import useShareKit from '../../utilities/useShareKit';
import TextareaAutosize from 'react-textarea-autosize';
import DateConverter from '../../../helpers/DateConverter';




export default function CommentGotModal({ state, categories, ...rest }) {

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
    let maxChar = 2000;
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
        let token;
        if (auth()) {
            token = localStorage.getItem("adminDetails");
            token = JSON.parse(token);
            token = token.token;
        } else {
            token = "";
        }

        const getConfession = async () => {
            let obj = {
                data: {},
                token: token,
                method: "get",
                url: `getconfession/${state.postId}`
            }

            try {
                const response = await fetchData(obj)
                if (response.data.status === true) {
                    setConfessionData(response.data.confession);

                    // console.log(response.data.confession);
                    setSharedBy(response.data.confession.no_of_comments)
                    setPostId(response.data.confession.confession_id);
                    setIsValidPost(true);
                } else {
                    //Handles app in case of no api response
                    setIsValidPost(false);
                    setConfessionData(true);
                }
                setIsWaitingRes(false);
            } catch {
                setIsWaitingRes(false);
                setIsServerErr(true);
            }
        }
        getConfession();
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

    // console.log({confessionData});


    return (
        <>
            <Modal show={state.visibility} size="lg" className="commentsModal" onHide={handleCommentsModal}>
                <Modal.Header className='justify-content-between'>
                    <h6>Comments</h6>
                    <span onClick={handleCommentsModal} type="button">
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                </Modal.Header>
                <Modal.Body className="privacyBody pt-0">
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

                                                        {isValidPost ? <div className="postCont">
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
                                                                    <Link className={`textDecNone `}
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


                                                                {auth()
                                                                    ?
                                                                    <div className="container-fluid inputWithForwardCont">
                                                                        <div className="inputToAddComment textAreaToComment mb-1 my-md-0">
                                                                            <TextareaAutosize type="text" maxLength={maxChar} row='1' value={comment} onKeyDown={(e) => { checkKeyPressed(e) }} onChange={(e) => { setComment(e.target.value) }} className="form-control mt-0 mb-2 mb-md-3"></TextareaAutosize>

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

                                                            <div className="postFoot">
                                                                <div className="totalComments">
                                                                    {sharedBy}  - People shared their thoughts about this post
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
                                                                    scrollableTarget="postsMainCont"
                                                                    endMessage={
                                                                        <div className="endListMessage mt-2 pb-0">
                                                                            End of Comments,
                                                                            <span
                                                                                className='closeBackButton'
                                                                                onClick={handleCommentsModal}>
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
                                                                            changeListener={changeListener}
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
                                                                        onClick={handleCommentsModal}>
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
