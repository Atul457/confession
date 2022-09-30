import React, { useState, useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Category from '../../components/Category';
import userIcon from '../../../../images/userAcc.png';
import forwardIcon from '../../../../images/forwardIcon.svg';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { Link } from "react-router-dom";
import SiteLoader from "../../components/SiteLoader";
import { useNavigate } from "react-router-dom";
import Lightbox from "react-awesome-lightbox";
import { fetchData } from '../../../../commonApi';
import "react-awesome-lightbox/build/style.css";
import { useParams } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import logo from '../../../../images/appLogo.svg'
import commentCountIcon from '../../../../images/commentCountIcon.svg';
import upvote from '../../../../images/upvote.svg';
import upvoted from '../../../../images/upvoted.svg';
import DateConverter from '../../../../helpers/DateConverter';
import { openCModal as openCommentsModalFn } from '../../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import useCommentsModal from '../../../utilities/useCommentsModal';
import { getToken } from '../../../../helpers/getToken';
import viewsCountIcon from '../../../../images/viewsCountIcon.svg';
import _ from 'lodash';
import ReportPostModal from '../../Modals/ReportPostModal';
import ReportCommentModal from '../../Modals/ReportCommentModal';


export default function CommentsGot(props) {

    let maxChar = 2000;
    const params = useParams();
    let history = useNavigate();
    const dispatch = useDispatch();
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const {
        commentsModalReducer,
        reportPostModalReducer,
        reportComModalReducer: reportModalReducer
    } = useSelector(state => state);
    const [confessionData, setConfessionData] = useState(false);
    const [isWaitingRes, setIsWaitingRes] = useState(true);
    const [isServerErr, setIsServerErr] = useState(false);
    const [isValidPost, setIsValidPost] = useState(true);   //MEANS STATUS IS OK BUT GOT NO RES
    const [comment, setComment] = useState('');
    const [requiredError, setRequiredError] = useState('');
    const [lightBox, setLightBox] = useState(false);
    const [activeCat, setActiveCat] = useState(false);
    const [loaded, setLoaded] = useState(false)
    const [reqFulfilled, setReqFullfilled] = useState(false);
    const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentGotModal] = useCommentsModal();
    const isCoverTypePost = confessionData?.category_id === 0
    const postBg = isCoverTypePost ? {
        backgroundImage: `url('${confessionData?.cover_image}')`,
        name: "post"
    } : {}


    // OPENS THE MODAL
    const openCommentsModal = () => {

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
            "description": confessionData.description,
            "no_of_comments": confessionData.no_of_comments,
            "post_as_anonymous": confessionData.post_as_anonymous,
            "profile_image": confessionData.profile_image,
            "user_id": confessionData.user_id === '0' ? false : confessionData.user_id,
            "image": confessionData.image === '' ? '' : confessionData.image,
            "isNotFriend": confessionData.isNotFriend,
            "is_viewed": confessionData.is_viewed,
            "updatedConfessions": () => { },
            "like": confessionData.like,
            "slug": confessionData.slug,
            "is_liked": confessionData.is_liked,
            "isReported": confessionData.isReported,
            "dislike": confessionData.dislike,
            "is_liked_prev": confessionData.is_liked,
            "cover_image": confessionData.cover_image,
            "updateConfessionData": updateConfessionData
        }))
    }

    // POST NEW COMMENT
    const doComment_ = async () => {
        var arr, _comment, userData;

        userData = getToken();

        setRequiredError('');
        if (comment === '') {
            setRequiredError('This field is required');
            return false;
        }
        _comment = comment;
        setComment("");
        arr = {
            "confession_id": params.postId,
            "comment": _comment,
            "comment_id": ""
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

                setComment("");
                let data = { no_of_comments: confessionData.no_of_comments + 1 };
                updateConfessionData(0, data);  //INCREMENTS THE COMMENT COUNT

            } else {
                setRequiredError(response.data.message);
            }
        }
        catch {
            console.log('some error occured');
        }
    }


    // POST COMMENT
    const doComment = _.debounce(doComment_, 1000);


    // GET CONFESSION FUNCTION
    async function getConfession() {

        let token;
        token = getToken();

        let obj = {
            data: {},
            token: token,
            method: "get",
            url: `getconfession/${params.postId}`
        }

        try {
            const response = await fetchData(obj)
            if (response.data.status === true) {

                let activeCategory = response.data.confession.category_id;
                setActiveCat(activeCategory);
                setIsWaitingRes(false);
                setConfessionData(response.data.confession);
                return setLoaded(true);
            }

            //Handles app in case of no api response
            setIsValidPost(false);
            setConfessionData(true);
            setLoaded(false);
            setIsWaitingRes(false);

        } catch {
            setIsWaitingRes(false);
            setIsValidPost(false);
            setConfessionData(true);
            setLoaded(false);
        }
    }


    // REFETCH COMMENTS ON URL POSTID CHANGE
    useEffect(() => {
        setConfessionData(false)
        setLoaded(false);
        getConfession();
    }, [params.postId])


    // OPENS THE COMMENTS MODAL FIRST TIME AFTER COMMENT DATA HAS BEEN LOADED
    useEffect(() => {
        if (loaded && Object.keys(confessionData).length > 0) openCommentsModal();
    }, [loaded])


    // REOPENS THE COMMENTS MODAL ON CONFESSION_ID CHANGE
    useEffect(() => {
        if (params.postId === confessionData.confession_id && !reqFulfilled) setReqFullfilled(true)
        if (reqFulfilled) setReqFullfilled(false)
    }, [params.postId])


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
            doComment(false, '');
        }
    }


    // LIKE UNLIKE FUNCTIONALITY
    const upvoteOrDownvote = async (isLiked) => {

        let is_liked, ip_address, check_ip, token = '', data;
        is_liked = isLiked ? 1 : 2;
        ip_address = localStorage.getItem("ip")
        check_ip = ip_address.split(".").length
        token = getToken();

        if (check_ip === 4) {
            let obj = {
                data: { is_liked, ip_address },
                token: token,
                method: "post",
                url: `likedislike/${confessionData.confession_id}`
            }
            try {
                data = {
                    like: isLiked ? confessionData.like + 1 : confessionData.like - 1,
                    is_liked: isLiked ? 1 : 2
                }
                updateConfessionData(0, data);
                const res = await fetchData(obj)
                if (res.data.status === true) {
                } else console.log(res)
            } catch (error) {
                console.log(error);
                console.log("Some error occured");
            }
        } else console.log("Invalid ip");
    }


    // UPDATES THE CONFESSION DATA ON THE COMMENTS GOT PAGE
    function updateConfessionData(index, data) {
        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = { ...confessionData };
        updatedConfessionNode = updatedConfessionArray;
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray = updatedConfessionNode;
        setConfessionData({ ...updatedConfessionArray });
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


                                                            {!isCoverTypePost && <span className="catCommentBtnCont">
                                                                <div className="categoryOfUser" type="button">{(confessionData.category_name).charAt(0) + (confessionData.category_name).slice(1).toLowerCase()}</div>
                                                            </span>}
                                                            <span className="postCreatedTime">
                                                                {DateConverter(confessionData.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className={`postBody ${isCoverTypePost ? 'coverTypePost' : ''}`}
                                                            onClick={openCommentsModal}
                                                            style={postBg}>
                                                            <div
                                                                className="postedPost"
                                                                type="button">
                                                                <pre className="preToNormal">
                                                                    {confessionData.description}
                                                                </pre>
                                                            </div>
                                                        </div>


                                                        {(confessionData.image !== null && (confessionData.image).length > 0)
                                                            &&
                                                            (
                                                                <div className="form-group imgPreviewCont mt-2 mb-0">
                                                                    <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }} >
                                                                        {
                                                                            (confessionData.image).map((src, index) => {
                                                                                return (
                                                                                    <span
                                                                                        className="uploadeImgWrapper fetched"
                                                                                        key={`uploadeImgWrapper${index}`}>
                                                                                        <img src={src} alt="" className='previewImg' />
                                                                                    </span>)
                                                                            })
                                                                        }
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
                                                                <div type="button" id="postButtonComGot" className="arrowToAddComment" onClick={() => { doComment() }}>
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

                                                        <div className="postFoot">
                                                            {auth() === false &&
                                                                <span className="feedPageLoginBtnCont postLoginBtnCont">
                                                                    <Link to="/login">
                                                                        <div className="categoryOfUser enhancedStyle" type="button">
                                                                            Login to comment
                                                                        </div>
                                                                    </Link>
                                                                </span>}

                                                            <div className={`iconsCont ${auth() === false ? 'mainDesignOnWrap' : ''}`}>

                                                                <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button" onClick={openCommentsModal}>
                                                                    <img src={viewsCountIcon} alt="" />
                                                                    <span className="count">{confessionData.viewcount}</span>
                                                                </div>


                                                                <div className="upvote_downvote_icons_cont  ml-0" type="button" onClick={openCommentsModal}>
                                                                    <img src={commentCountIcon} alt="" />
                                                                    <span className="count">
                                                                        {confessionData.no_of_comments}
                                                                    </span>
                                                                </div>


                                                                {(confessionData.hasOwnProperty("is_liked")
                                                                    ?
                                                                    <div className='iconsMainCont'>
                                                                        <div className={`upvote_downvote_icons_cont buttonType`}>
                                                                            {confessionData.is_liked === 1 ?
                                                                                <img src={upvoted} alt="" onClick={() => upvoteOrDownvote(false)} /> :
                                                                                <img src={upvote} alt="" onClick={() => upvoteOrDownvote(true)} />}
                                                                            <span className='count'>{confessionData.like}</span>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className='iconsMainCont'>
                                                                        <div className={`upvote_downvote_icons_cont`}>
                                                                            <img src={upvote} alt="" />
                                                                            <span className='count'>{confessionData.like}</span>
                                                                        </div>
                                                                    </div>)}

                                                            </div>
                                                        </div>
                                                    </div>
                                                        :
                                                        <div className="alert alert-danger" role="alert">
                                                            This post does not exist or may have been deleted
                                                        </div>}

                                                </section>
                                            )
                                        )}

                                    {/* MIDDLECONTAINER */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
                :
                <SiteLoader />}

            {/* ReportPostsModal */}
            {
                reportPostModalReducer.visible && (
                    <ReportPostModal
                        updatedConfessions={updateConfessionData} />)
            }
            {/* ReportPostsModal */}

            {/* ReportCommentModal */}
            {reportModalReducer.visible && <ReportCommentModal />}
            {/* ReportCommentModal */}

        </div>
    );
}
