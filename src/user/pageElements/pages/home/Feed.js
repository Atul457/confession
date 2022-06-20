import React, { useState, useEffect, useRef } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Post from '../../components/Post';
import Category from '../../components/Category';
import manWithHorn from '../../../../images/manWithHorn.png';
import auth from '../../../behindScenes/Auth/AuthCheck';
import downArrowIcon from '../../../../images/downArrow.png';
import InfiniteScroll from "react-infinite-scroll-component";
import PrivacyModal from '../../Modals/PrivacyModal';
import { fetchData } from '../../../../commonApi';
import { useLocation } from 'react-router';
import useCommentsModal from "../../../utilities/useCommentsModal";
import RefreshButton from '../../../refreshButton/RefreshButton';
import TextareaAutosize from 'react-textarea-autosize';
import useFeaturesModal from '../../../utilities/useFeaturesModal';
import AdMob from '../../components/AdMob';
import AppLogo from '../../components/AppLogo';
import { useDispatch, useSelector } from 'react-redux';
import { FriendReqModal } from '../../Modals/FriendReqModal';
import postAlertActionCreators from '../../../../redux/actions/postAlert';
import PostAlertModal from '../../Modals/PostAlertModal';
import { changeCancelled, changeRequested, closeFRModal, toggleLoadingFn } from '../../../../redux/actions/friendReqModal';


export default function Feed(props) {

    // HITS API WILL PRESELECTED CATEGORY ON THE BASIS OF COMMENTS PAGE
    let actCategory = useLocation();

    const openSelect = () => {
        let selectedCategory = document.querySelector('#selectedCategory');
        selectedCategory.dispatchEvent(new Event('click'));
    }


    // SETS INITIAL CATEGORY ON WHICH THE API WILL GET HIT TO GET CONFESSIONS

    let noOfChar = 2000;
    const [pageNo, setPageNo] = useState(1);
    const dispatch = useDispatch();
    const [confCount, setConfCount] = useState(0);
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);
    const friendReqModalReducer = useSelector(state => state.friendReqModalReducer);
    const postAlertReducer = useSelector(state => state.postAlertReducer);
    const [AC2S, setAC2] = useState(() => {
        if (actCategory.state)
            return actCategory.state.active;
        else
            return "";
    });
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [activeCategory, setActiveCategory] = useState((AC2S) !== '' ? `${AC2S}` : `all`);
    const [confessions, setConfessions] = useState(false);
    const [confessionResults, setConfessionResults] = useState(true);
    // const afterHowManyShowAdd = useState(9);    //AFTER THIS MUCH SHOW ADDS
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [selectedCat, setSelectedCat] = useState("");
    const [categoryShow, setCategoryShow] = useState(false);
    const recaptchaRef = useRef(null);
    const [adSlots, setAdSlots] = useState([]);


    //CUSTOM HOOK
    const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentGotModal] = useCommentsModal();
    const [closeFeatures, openFeatures, Features, featuresState] = useFeaturesModal();

    // Privacy Modal
    const [privacyModal, setPrivacyModal] = useState({
        visible: false,
        accepted: localStorage.getItem("privacyAccepted") ? localStorage.getItem("privacyAccepted") : 0,
        isConfessionBeingPost: false
    });

    const acceptPrivacy = () => {
        setPrivacyModal({ ...privacyModal, visible: false });
        localStorage.setItem("privacyAccepted", 1);
    }


    useEffect(() => {
        if (!auth()) {
            let acceptedOrNot = localStorage.getItem("privacyAccepted");
            if (parseInt(acceptedOrNot) !== 1) {
                setPrivacyModal({
                    ...privacyModal,
                    visible: true
                })
            }

            if (privacyModal.accepted === true) {
                postConfession();
            }
        }
    }, [privacyModal.accepted])


    const handlePrivacyModal = () => {
        privacyModal.visible ?
            setPrivacyModal({ ...privacyModal, visible: false }) :
            setPrivacyModal({ ...privacyModal, visible: true })
    }
    // Privacy Modal


    async function getConfessions(append, act, page) {

        var token, loggedInUserData;
        setConfessionResults(true);

        if (auth()) {
            loggedInUserData = localStorage.getItem("userDetails");
            loggedInUserData = JSON.parse(loggedInUserData);
            token = loggedInUserData.token;
        } else {
            token = "";
        }

        let obj = {
            data: {},
            token: token,
            method: "get",
            url: `getconfessions/${act}/${page}`
        }

        try {
            const response = await fetchData(obj)
            if (response.data.status === true) {
                if (append) {
                    let newConf = [...confessions, ...response.data.confessions];
                    setConfessions(newConf);
                }
                else {
                    setConfCount(response.data.count);
                    setConfessions(response.data.confessions);
                }

                // console.table(response.data.confessions);

            } else {
                setConfessions(false);
                setConfessionResults(false);
            }

        } catch {
            setConfessions(false);
            setConfessionResults(false);    //SERVER ERROR
        }

    }


    // UPDATES THE ACTIVECATEGORY
    const updateActiveCategory = (activeCat) => {
        setGoDownArrow(false);
        setConfessions(false);
        setConfCount(1);
        setPageNo(1);
        setAC2(activeCat);
        setActiveCategory(`${activeCat}`);
    }


    //PREVENTS DOUBLE POST
    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#postConfessionBtn');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");
    }


    //POSTS CONFESSION FROM FEED PAGE
    const postConfession = async () => {

        preventDoubleClick(true);

        let postConfessionArr,
            token = '',
            loggedInUserData,
            post_as_anonymous = 1,
            feedDescErrorCont = document.getElementById("feedDescErrorCont"),
            feedPostConfResponseCont = document.getElementById("feedPostConfResponseCont");

        let recapToken = ""

        window.grecaptcha.ready(() => {
            window.grecaptcha.execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", { action: 'submit' }).then(token => {
                recapToken = token;
                executePostConfession();
            });
        });

        const executePostConfession = async () => {

            if (description.trim() !== '') {

                preventDoubleClick(true);

                feedDescErrorCont.innerText = "";
                if (auth()) {
                    loggedInUserData = localStorage.getItem("userDetails");
                    loggedInUserData = JSON.parse(loggedInUserData);
                    post_as_anonymous = loggedInUserData.profile.post_as_anonymous;
                    token = loggedInUserData.token;
                    recapToken = "";
                }
                else if (recapToken === '') {
                    feedDescErrorCont.innerText = "Recaptcha is required";
                    preventDoubleClick(false);
                    return false;
                }

                if (selectedCat === '') {
                    feedDescErrorCont.innerText = "Please select a category";
                    preventDoubleClick(false);
                    return false;
                }

                if (auth() && post_as_anonymous === 0) {
                    if (postAlertReducer.postAnyway === false) {
                        dispatch(postAlertActionCreators.openModal());
                        return false;
                    }
                }

                postConfessionArr = {
                    "description": description,
                    "category_id": selectedCat,
                    "post_as_anonymous": post_as_anonymous,
                    "image": "",
                    "code": token === '' ? recapToken : ''
                };

                //PRIVAY MODAL :: RUNS IF NOT AUTHENTICATED
                if (!auth()) {
                    if (localStorage.getItem("privacyAccepted") ? (parseInt(localStorage.getItem("privacyAccepted")) !== 1 ? true : false) : true) {
                        setPrivacyModal({ ...privacyModal, isConfessionBeingPost: true, visible: true })
                        return false;
                    }
                }


                let obj = {
                    data: postConfessionArr,
                    token: token,
                    method: "post",
                    url: "createconfession"
                }


                try {
                    const response = await fetchData(obj);
                    setIsLoading(true);
                    if (response.data.status === true) {
                        feedDescErrorCont.innerText = "";
                        setErrorOrSuccess(true);
                        setDescription("");
                        setSelectedCat("");
                        getConfessions(false, activeCategory, 1);
                        feedPostConfResponseCont.innerHTML = response.data.message;
                    } else {
                        setErrorOrSuccess(false);
                        feedPostConfResponseCont.innerHTML = response.data.message;
                    }

                    setSelectedCat("");
                    //RESETS THE SELECT BOX
                    let selectRef = document.querySelector('#selectedCategory');
                    selectRef.selectedIndex = 0;
                    setIsLoading(false);

                    setTimeout(() => {
                        feedPostConfResponseCont.innerHTML = "";
                    }, 2000);

                } catch (err) {
                    console.log(err);
                    setErrorOrSuccess(false);
                    setIsLoading(false);
                    setSelectedCat("");
                    let selectRef = document.querySelector('#selectedCategory');
                    selectRef.selectedIndex = 0;
                    feedPostConfResponseCont.innerHTML = "Server Error, Please try again after some time...";
                }

                if (postAlertReducer.visible === true) {
                    dispatch(postAlertActionCreators.closeModal())
                }

                preventDoubleClick(false);
            }
            else {
                feedDescErrorCont.innerText = "This field is required";
                preventDoubleClick(false);
            }

        }
    }


    const fetchMoreData = () => {
        let page = pageNo;
        page = parseInt(page) + 1;
        setPageNo(page);
    }


    //HITS API TO GET CONFESSIONS
    useEffect(() => {
        destroySlots();
        getConfessions(false, activeCategory, 1);
        setPageNo(1);
    }, [activeCategory])


    useEffect(() => {
        if (pageNo !== 1) {
            getConfessions(true, activeCategory, pageNo);
        }
    }, [pageNo])


    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        document.addEventListener("scroll", () => {
            let scroll = document.querySelector("html").scrollTop;
            if (scroll > 3000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        })
    }, [])

    const updateConfessionData = (_viewcount, sharedBy, index) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        let shared = sharedBy;
        updatedConfessionArray = [...confessions];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            "no_of_comments": shared,
            "viewcount": _viewcount,
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setConfessions([...updatedConfessionArray]);
    }

    const updateCanBeRequested = (userId, action) => {
        let updatedConfessionArray;
        updatedConfessionArray = confessions.map((curr) => {
            if (curr.user_id === userId) {
                return {
                    ...curr,
                    "isNotFriend": action
                }
            } else {
                return curr;
            }
        })
        setConfessions([...updatedConfessionArray]);
    }

    const updatedConfessions = (index, data) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = [...confessions];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setConfessions([...updatedConfessionArray]);
    }


    //SCROLLS TO BOTTOM
    const goUp = () => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }


    //DESTROYS SLOTS CREATED FOR ADS
    const destroySlots = () => {
        window.googletag = window.googletag || { cmd: [] };
        if (window.googletag.destroySlots) {
            window.googletag.destroySlots();
        }
    }

    //DELAY
    const openFeaturesDelay = () => {
        setTimeout(() => {
            openFeatures();
        }, 25 * 1000)
    }


    return (
        <div className="container-fluid">
            {commentsModalReducer.visible && <CommentGotModal
                handleChanges={handleChanges}
                updateConfessionData={updateConfessionData}
                updatedConfessions={updatedConfessions}
                state={commentsModal}
                handleCommentsModal={handleCommentsModal} />}
            <div className="row outerContWrapper">

                <Header links={true}></Header>

                <div className="leftColumn leftColumnFeed">
                    <div className="leftColumnWrapper">
                        <AppLogo />

                        <div className="middleContLoginReg feedMiddleCont">
                            {/* CATEGORYCONT */}
                            <aside className="posSticky">
                                <Category categories={props.categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} />
                            </aside>
                            {/* CATEGORYCONT */}
                        </div>
                    </div>
                </div>


                <div className="rightColumn rightColumnFeed">
                    <div className="rightMainFormCont rightMainFormContFeed p-0">
                        <div className="preventHeader">preventHead</div>
                        <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                            <div className="row forPosSticky">

                                {/* MIDDLECONTAINER */}
                                <section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                                    <div className="postsMainCont">

                                        {/* POST MAIN CONT START */}
                                        <div className="postCont hideBoxShadow">
                                            <div className="doCommentContHeader container-fluid">
                                                <span className="confessImgContInCaptha col-12 col-md-3">
                                                    <img src={manWithHorn} alt="" />
                                                </span>
                                                <div className="doCommentTitle col-12 col-md-9">
                                                    <div>What's The Talk Place About?</div>
                                                    <div className='mainParafeed'>
                                                        It's a safe space to share your thoughts ANONYMOUSLY.<br /> It's our contribution to mental health and the fight against the growing rate of depression.<br /> To get stuff off your chest, just select a Category and POST.<br />
                                                        Create an account to make ANONYMOUS friends, comment on posts, and get notified when people respond or send friend requests.<br />
                                                        Be honest and authentic; we're not afraid of crazy.<br /> Just be KIND with your responses. 😊

                                                    </div>
                                                    <div className='mainParafeed mt-0'>
                                                        Love the app? Don't forget to share!
                                                    </div>
                                                    <div className='mainParafeed mt-1 font-weight-bold'>
                                                        You're anonymous.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="postBody">
                                                <span className="d-block errorCont text-danger my-2" id="feedDescErrorCont"></span>
                                                <div className="container-fluid inputWithForwardCont">
                                                    <div className="col-12 inputToAddComment toDoinputToAddComment">
                                                        <TextareaAutosize
                                                            className="form-control"
                                                            minRows={5}
                                                            maxLength={noOfChar}
                                                            value={description}
                                                            placeholder={"What’s REALLY on your mind?"}
                                                            onChange={(e) => {
                                                                setDescription(e.target.value)
                                                            }}
                                                        ></TextareaAutosize>
                                                        <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="postFoot createConfFeedPostFoot">
                                                <div className="recaptchaFeed feed w-100">

                                                    <div className="selectNpostBtnCont">
                                                        <div className="form-group createPostInputs createInputSelect mb-0">
                                                            <select
                                                                className="form-control"
                                                                onChange={(e) => setSelectedCat(e.target.value)}
                                                                id="selectedCategory"
                                                                name="category">
                                                                <option value={""}>Select Category </option>

                                                                {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
                                                                {props.categories ? props.categories.map((element) => {
                                                                    return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
                                                                }) : <option value="">Categories not found</option>}
                                                                {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

                                                            </select>
                                                            <img src={downArrowIcon} alt="" type="button" onClick={openSelect} />
                                                            <span className="d-block errorCont text-danger" id="catErrorCont"></span>
                                                        </div>

                                                        <div className="doPostBtn" type="button" id="postConfessionBtn" onClick={() => { postConfession() }}>
                                                            <div className="">
                                                                {isLoading
                                                                    ?
                                                                    <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                                                        <span className="sr-only">Loading...</span>
                                                                    </div>
                                                                    :
                                                                    "Post"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className={`responseCont mb-2 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="feedPostConfResponseCont"></div>
                                            </div>
                                        </div>
                                        {/* POST MAIN CONT START */}


                                        <div className="row mx-0">

                                            <div className="expandableCategory d-none">
                                                <div className="head" onClick={() => setCategoryShow(!categoryShow)}>
                                                    Choose a Category to filter posts
                                                    <span>
                                                        <i aria-hidden="true" className={`fa fa-chevron-down categoryDownIcon ${categoryShow ? "rotateUpsideDown" : ""}`}></i>
                                                    </span>
                                                </div>
                                                {categoryShow && <div className="body">
                                                    {/* CATEGORYCONT */}
                                                    <aside className="col-12 col-md-4 posSticky mobileViewCategories d-none">
                                                        <Category hideHead={true} categories={props.categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} />
                                                    </aside>
                                                    {/* CATEGORYCONT */}
                                                </div>}

                                            </div>

                                            <div className="filterVerbiage foot">
                                                * Filter out posts by clicking on the categories above. Unselect the category to remove the filter.
                                            </div>


                                            {/* CONFESSIONS CONT */}
                                            <div className="postsWrapperFeed col-12 px-0">
                                                {confessions
                                                    ?
                                                    <InfiniteScroll
                                                        scrollThreshold="80%"
                                                        endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Confessions</div>}
                                                        dataLength={confessions.length}
                                                        next={fetchMoreData}
                                                        hasMore={confessions.length < confCount}
                                                        loader={
                                                            <div className="spinner-border pColor text-center" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        }
                                                    >
                                                        {confessions.map((post, index) => {
                                                            return (<>
                                                                <Post
                                                                    index={index}
                                                                    is_viewed={post.is_viewed}
                                                                    isRegistered={post.isRegistered}
                                                                    updateCanBeRequested={updateCanBeRequested}
                                                                    viewcount={post.viewcount}
                                                                    handleCommentsModal={handleCommentsModal}
                                                                    updateConfessionData={updateConfessionData}
                                                                    key={`fConf${index}`}
                                                                    createdAt={post.created_at}
                                                                    post_as_anonymous={post.post_as_anonymous}
                                                                    curid={post.user_id === '0' ? false : post.user_id} category_id={post.category_id} profileImg={post.profile_image}
                                                                    postId={post.confession_id}
                                                                    imgUrl={post.image === '' ? '' : post.image}
                                                                    userName={post.created_by}
                                                                    category={post.category_name}
                                                                    updatedConfessions={updatedConfessions}
                                                                    postedComment={post.description}
                                                                    isNotFriend={post.isNotFriend}
                                                                    like={post.like}
                                                                    dislike={post.dislike}
                                                                    is_liked={post.is_liked}
                                                                    sharedBy={post.no_of_comments} />

                                                                {((index + 1) % 10 === 0) &&
                                                                    <div className="mb-4">
                                                                        <AdMob mainContId={`adIndex${index}`} setAddSlots={setAdSlots} slots={adSlots} />
                                                                    </div>
                                                                }
                                                            </>)
                                                        })}
                                                    </InfiniteScroll>

                                                    :
                                                    (
                                                        confessionResults
                                                            ?
                                                            (<div className="text-center">
                                                                <div className="spinner-border pColor" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                            </div>)
                                                            :
                                                            (<div className="alert alert-danger" role="alert">
                                                                Unable to get confessions
                                                            </div>)

                                                    )
                                                }
                                            </div>
                                            {/* CONFESSIONS CONT */}
                                        </div>
                                    </div>

                                </section>
                                {/* MIDDLECONTAINER */}
                            </div>


                        </div>
                    </div>
                </div>

                {/* PRIVACY MODAL */}
                <PrivacyModal
                    privacyModal={privacyModal}
                    acceptPrivacy={acceptPrivacy}
                    handlePrivacyModal={handlePrivacyModal}
                    openFeatures={openFeaturesDelay}
                />
                {/* PRIVACY MODAL */}

                <Features
                    visible={featuresState.visibile}
                    closeModal={closeFeatures}
                />


                <Footer />
                <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>

                {/* REFRESH BUTTON */}
                {commentsModal.visibility === false && changes && <RefreshButton />}

            </div>

            {friendReqModalReducer.visible === true &&
                <FriendReqModal
                    cancelReq={props.isNotFriend === 2 ? true : false}
                    changeCancelled={changeCancelled}
                    userId={props.curid}
                    closeFrReqModalFn={closeFRModal}
                    toggleLoadingFn={toggleLoadingFn}
                    changeRequested={changeRequested}
                    _updateCanBeRequested={updateCanBeRequested}
                />}

            {postAlertReducer.visible === true &&
                <PostAlertModal
                    preventDoubleClick={preventDoubleClick}
                    postConfession={postConfession}
                />}
        </div>
    );
}
