import React, { useState, useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Comments from '../../components/Comments';
import Category from '../../components/Category';
import userIcon from '../../../../images/userAcc.png';
import forwardIcon from '../../../../images/forwardIcon.svg';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { Link } from "react-router-dom";
import SiteLoader from "../../components/SiteLoader";
import { useNavigate } from "react-router-dom";
import SetAuth from '../../../behindScenes/SetAuth';
import Lightbox from "react-awesome-lightbox";
import { fetchData } from '../../../../commonApi';
import "react-awesome-lightbox/build/style.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import logo from '../../../../images/appLogo.svg'
import DateConverter from '../../../../helpers/DateConverter';
import { openCModal as openCommentsModalFn } from '../../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import CommentGotModal from '../../Modals/CommentGotModal';
import useCommentsModal from '../../../utilities/useCommentsModal';



export default function CommentsGot(props) {


    let maxChar = 2000;
    const params = useParams();
    let history = useNavigate();
    const dispatch = useDispatch();
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);
    const [confessionData, setConfessionData] = useState(false);
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
    const [activeCat, setActiveCat] = useState(false);
    const [reqFulfilled, setReqFullfilled] = useState(false);
    const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentGotModal] = useCommentsModal();
    const [commentsCount, setCommentsCount] = useState(0);
    const [goDownArrow, setGoDownArrow] = useState(false);

    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#postButtonComGot');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }


    const openCommentsModal = () => {

        console.log({ confessionData });

        dispatch(openCommentsModalFn({
            "postId": confessionData.confession_id,
            "viewcount": confessionData.viewcount,
            "visibility": true,
            "index": 0,
            "userName": confessionData.userName,
            "postedComment": confessionData.description,
            "category_id": confessionData.category_id,
            "category_name": confessionData.category_name,
            "confession_id": confessionData.confession_id,
            "created_at": confessionData.created_at,
            "created_by": confessionData.created_by,
            "description": confessionData.postedComment,
            "no_of_comments": confessionData.no_of_comments,
            "post_as_anonymous": confessionData.post_as_anonymous,
            "profile_image": confessionData.profile_image,
            "user_id": confessionData.user_id === '0' ? false : confessionData.user_id,
            "image": confessionData.image === '' ? '' : confessionData.image,
            "isNotFriend": confessionData.isNotFriend,
            "is_viewed": confessionData.is_viewed,
            "updatedConfessions": () => { },
            "like": confessionData.like,
            "is_liked": confessionData.is_liked,
            "dislike": confessionData.dislike,
            "is_liked_prev": confessionData.is_liked,
            "updateConfessionData": () => { }
        }))


    }


    const doComment = async (comment_id = false, editedComment = "") => {

        preventDoubleClick(true);
        var arr, _comment, userData;

        userData = localStorage.getItem("userDetails");
        if (userData === "" || userData === null) {
            SetAuth(0);
            history("/login");
            return false;
        }
        userData = JSON.parse(userData).token;



        if (comment_id === false)       //NEW COMMENT
        {
            setRequiredError('');
            if (comment === '') {
                setRequiredError('This is required field');
                preventDoubleClick(false);
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
            console.log("update");
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
        preventDoubleClick(false);
    }


    useEffect(() => {
        window.scrollTo(0, 0);

        let token;
        if (auth()) {
            token = localStorage.getItem("userDetails");
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
                url: `getconfession/${params.postId}`
            }

            try {
                const response = await fetchData(obj)
                if (response.data.status === true) {
                    // setReqFullfilled(true);
                    setConfessionData(response.data.confession);
                    console.log({ res: response.data.confession });
                    setSharedBy(response.data.confession.no_of_comments)
                    setPostId(response.data.confession.confession_id);

                    let activeCategory = response.data.confession.category_id;
                    setActiveCat(activeCategory);


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

    }, [params.postId])


    useEffect(() => {
        if (reqFulfilled === false && confessionData !== false) {
            setReqFullfilled(true);
            openCommentsModal();

        }
    }, [reqFulfilled, confessionData])




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
            "confession_id": params.postId,
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
    }, [])


    // TAKES YOU TO THE HOME PAGE, AND LOADS THE ACTIVECAT CONFESSION DATA
    const updateActiveCategory = (activeCat) => {
        history(`/home`, { state: { active: activeCat } });
    }

    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event) => {
        if (event.keyCode === 13 && event.shiftKey) {
            setComment(comment);
        } else if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            doComment(props.postId);
        }
    }


    const fetchMoreComments = () => {
        commentsOnCconfession((commentsData.page + 1), true);
    }

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        document.addEventListener("scroll", () => {
            let scroll = document.querySelector("html").scrollTop;
            if (scroll > 1000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        })
    }, [])


    const updateComment = (commentData) => {
        doComment(commentData.comment_id, commentData.comment);
    }


    //SCROLLS TO BOTTOM
    const goUp = () => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }

    return (
        <div className="container-fluid">

            {commentsModalReducer.visible && <CommentGotModal
                handleChanges={handleChanges}
                updateConfessionData={() => { }}
                updatedConfessions={() => { }}
                state={commentsModal}
                handleCommentsModal={handleCommentsModal} />}


            {confessionData
                ?
                <div className="row">
                    <Header links={true} />

                    <div className="leftColumn leftColumnFeed">
                        <div className="leftColumnWrapper">
                            <div className="appLogo">
                                <img src={logo} alt="" />
                            </div>

                            <div className="middleContLoginReg feedMiddleCont">
                                {/* CATEGORYCONT */}
                                <aside className="posSticky">
                                    <Category activeCatIndex={activeCat} categories={props.categories} updateActiveCategory={updateActiveCategory} />
                                </aside>
                                {/* CATEGORYCONT */}
                            </div>
                        </div>
                    </div>


                    {lightBox && (
                        confessionData.image && ((confessionData.image).length !== 0 && ((confessionData.image).length > 1
                            ?
                            (<Lightbox images={confessionData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                            :
                            (<Lightbox image={confessionData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                    )}


                    <div className="rightColumn rightColumnFeed">
                        <div className="rightMainFormCont rightMainFormContFeed p-0">
                            <div className="preventHeader">preventHead</div>
                            <div className="py-md-4 p-3 preventFooter w-100">
                                <div className="row forPosSticky">

                                    {/* MIDDLECONTAINER */}

                                    {isWaitingRes
                                        ?
                                        <section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                                            <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </section>
                                        :
                                        (isServerErr
                                            ?
                                            (<section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                                                <div className="alert alert-danger" role="alert">
                                                    Server Error.. Please try again
                                                </div>
                                            </section>)
                                            :
                                            (
                                                <section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                                                    {isValidPost ? <div className="postCont">
                                                        <div className="postContHeader justify-content-start">
                                                            <span className="userImage userImageFeed">
                                                                <img src={confessionData.profile_image === '' ? userIcon : confessionData.profile_image} className="userAccIcon" alt="" />
                                                            </span>

                                                            {confessionData.post_as_anonymous === 1
                                                                ? <span className="userName removeElipses">
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
                                                            <div className="postedPost" onClick={openCommentsModal} type="button">
                                                                <pre className="preToNormal">
                                                                    {confessionData.description}
                                                                </pre>
                                                            </div>


                                                            {(confessionData.image !== null && (confessionData.image).length > 0)
                                                                &&
                                                                (
                                                                    <div className="form-group imgPreviewCont mt-2 mb-0">
                                                                        <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }} >
                                                                            {(confessionData.image).map((src, index) => {
                                                                                return (
                                                                                    <span
                                                                                        className="uploadeImgWrapper fetched"
                                                                                        key={`uploadeImgWrapper${index}`}>
                                                                                        <img src={src} alt="" className='previewImg' />
                                                                                    </span>)
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }


                                                            {auth()
                                                                ?
                                                                <div className="container-fluid inputWithForwardCont">
                                                                    <div className="inputToAddComment textAreaToComment w-100">
                                                                        <TextareaAutosize type="text" maxLength={maxChar} row='1' value={comment} onKeyDown={(e) => { checkKeyPressed(e) }} onChange={(e) => { setComment(e.target.value) }} className="form-control my-3"></TextareaAutosize>

                                                                    </div>
                                                                    <div type="button" id="postButtonComGot" className="arrowToAddComment" onClick={() => { doComment(props.postId) }}>
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
                                                            The post doesn't exist
                                                        </div>}

                                                    {/* {isValidPost && <div className="postsMainCont">
                                                        {commentsArr.length > 0
                                                            &&
                                                            <InfiniteScroll
                                                                endMessage={<div className="endListMessage mt-4 pb-3">End of Comments</div>}
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
                                                                        postId={params.postId}
                                                                        updateComment={updateComment}
                                                                        commentId={post.comment_id}
                                                                        countChild={post.countChild}
                                                                        is_editable={post.is_editable}
                                                                        created_at={post.created_at}
                                                                        curid={(post.user_id === '' || post.user_id === 0) ? false : post.user_id}
                                                                        key={"Arr" + index + "dp"}
                                                                        imgUrl={post.profile_image} userName={post.comment_by}
                                                                        postedComment={post.comment} />

                                                                })}
                                                            </InfiniteScroll>
                                                        }

                                                    </div>} */}

                                                </section>
                                            )
                                        )}

                                    {/* MIDDLECONTAINER */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
                    <Footer />
                </div>
                :
                <SiteLoader />}

        </div>
    );
}
