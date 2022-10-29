import React, { useState, useEffect, useRef } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Post from '../../components/Post';
import Category from '../../components/Category';
import instaSocial from '../../../../images/instaSocial.svg'
import removeImgIcon from '../../../../images/removeImgIcon.png';
import uploadImages from '../../../../images/uploadImages.svg';

import ExtValidator from '../../../../extensionValidator/ExtValidator';
import TwitterSocial from '../../../../images/TwitterSocial.svg'
import tiktokSocial from '../../../../images/tiktokSocial.svg'
import fbSocial from '../../../../images/fbSocial.svg'
import auth from '../../../behindScenes/Auth/AuthCheck';
import downArrowIcon from '../../../../images/downArrow.png';
import confessionBanner from '../../../../images/confessionBanner.png';
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
import { setPostBoxState } from '../../../../redux/actions/postBoxState';
import _ from 'lodash';
import { pulsationHelper } from '../../../../helpers/pulsationHelper';
import ReportCommentModal from '../../Modals/ReportCommentModal';
import AvatarsIntroModal from '../../Modals/AvatarsIntroModal';
import { toggleAvatarIntroModal } from '../../../../redux/actions/avatarsIntroModalAc/avatarsIntroModalAc';
import { AppreciationModal, HeartComponent, ShareWithLoveModal } from '../../components/sharepostwithlove/Sharepostwithlove';
import ReportPostModal from '../../Modals/ReportPostModal';
import { getLocalStorageKey, isAvatarSelectedCurr } from "../../../../helpers/helpers"
import RightSideAdComp from '../../../../components/sidebarAds/RightSideAdComp';
import { toggleShareWithLoveModal } from '../../../../redux/actions/shareWithLoveAc/shareWithLoveAc';


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
    const reportModalReducer = useSelector(state => state.reportComModalReducer)
    const reportPostModalReducer = useSelector(state => state.reportPostModalReducer)
    const avatarsIntroModalReducer = useSelector(state => state.avatarsIntroModalReducer)
    const verifyEmailReducer = useSelector(state => state.VerifyEmail)
    const [confCount, setConfCount] = useState(0);
    const { commentsModalReducer, shareWithLoveReducer } = useSelector(state => state);
    const { appreciationModal } = shareWithLoveReducer;
    const friendReqModalReducer = useSelector(state => state.friendReqModalReducer);
    const postBoxStateReducer = useSelector(state => state.postBoxStateReducer.feed);
    const postAlertReducer = useSelector(state => state.postAlertReducer);
    const [AC2S, setAC2] = useState(() => {
        if (actCategory.state && !actCategory?.state?.openFeatures)
            return actCategory.state.active;
        return "";
    });
    const [activeCategory, setActiveCategory] = useState((AC2S) !== '' ? `${AC2S}` : `all`);
    const [confessions, setConfessions] = useState(false);
    const [confessionResults, setConfessionResults] = useState(true);
    const [afterHowManyShowAdd] = useState(7);    //AFTER THIS MUCH SHOW ADDS
    const [isLoading, setIsLoading] = useState(false);
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [selectedCat, setSelectedCat] = useState(postBoxStateReducer.selectedCat ?? "");
    const [categoryShow, setCategoryShow] = useState(false);
    const [adSlots, setAdSlots] = useState([]);

    // Upload img box states
    const [selectedFile, setSelectedFile] = useState('');
    const [submittable, setSubmittable] = useState(true);
    const [base64Src, setBase64Src] = useState([]);
    const [imgPathArr, setImgPathArr] = useState([]);
    const [isImgLoading, setIsImgLoading] = useState(false);
    const heartCompRef = useRef(null)
    const goDownArrowRef = useRef(null)
    // let commentCountReqToPost = 1;
    // let isCondStatified = auth() ? getKeyProfileLoc("comments") > commentCountReqToPost : false
    let fs = 1024; //Sets the max file size that can be sent
    // Upload img box states


    //CUSTOM HOOK
    const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentGotModal] = useCommentsModal();
    const [closeFeatures, openFeatures, Features, featuresState] = useFeaturesModal();

    // Privacy Modal
    const [privacyModal, setPrivacyModal] = useState({
        visible: false,
        accepted: localStorage.getItem("privacyAccepted") ? localStorage.getItem("privacyAccepted") : 0,
        isConfessionBeingPost: false
    });

    // Avatar intro modal
    const openAvatarModal = () => {
        let commentsModalVisibility = commentsModalReducer.visible,
            shareWithLoveModalVisibility = shareWithLoveReducer.visible,
            appreciationModalVisibiltiy = appreciationModal?.visible
        if (commentsModalVisibility === false && appreciationModalVisibiltiy === false && shareWithLoveModalVisibility === false) {
            dispatch(toggleAvatarIntroModal({ visible: true, isShown: true }))
        }
    }

    const acceptPrivacy = () => {
        setPrivacyModal({ ...privacyModal, visible: false });
        localStorage.setItem("privacyAccepted", 1);
    }


    // Prevention from being open in sharewithlove modal, and comments got modal
    useEffect(() => {
        // only if verify email modal is closed by user then show avatars modal
        let timeout,
            isVerifyEmailModalShown = verifyEmailReducer.verified,
            privacyAccepted_ = getLocalStorageKey("privacyAccepted") === "1",
            isAvatarSelected = isAvatarSelectedCurr().status

        if ((isVerifyEmailModalShown
            && !isAvatarSelected
            && avatarsIntroModalReducer?.visible === false
            && avatarsIntroModalReducer?.isShown === false) || (auth() === false && avatarsIntroModalReducer?.isShown === false && privacyAccepted_)) {
            timeout = setTimeout(() => {
                openAvatarModal();
            }, 10000);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [commentsModalReducer, shareWithLoveReducer, verifyEmailReducer.verified, privacyModal.accepted])


    useEffect(() => {
        pulsationHelper()
        if (actCategory?.state?.openFeatures === true) openFeaturesDelay();
    }, [])


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

    // Remove uploaded image
    const removeImg = (indexToBeRemoved) => {
        setSubmittable(false);

        let base64SrcArr = base64Src.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        let imgPathArrN = imgPathArr.filter((elem, index) => {
            return index !== indexToBeRemoved && elem
        })

        setBase64Src(base64SrcArr);
        setImgPathArr(imgPathArrN);

        setTimeout(() => {
            setSubmittable(true);
        }, 1200);
    }
    // Remove uploaded image

    //IN PROGRESS
    const toBase64 = (e) => {

        let responseCont = document.getElementById('responseCont');
        responseCont.innerText = "";

        if (e.target.files[0]) {

            let fileObj;
            fileObj = e.target.files[0];

            //PREVENTS UNSPECIFIED EXTENSION FILESS
            if (!ExtValidator(fileObj)) {
                setErrorOrSuccess(prevState => !prevState === false && !prevState);
                responseCont.innerText = "Supported file types are gif, jpg, jpeg, png";
                return false;
            }

            setIsImgLoading(true);
            setSubmittable(false);
            let fileSize = parseInt(e.target.files[0].size / 2000);
            responseCont.innerHTML = '';

            if (fileSize > fs) {
                responseCont.innerHTML = '[Max FileSize: 2000KB], No file selected';
                setIsImgLoading(false);
                setSelectedFile('');
                setErrorOrSuccess(false);
                setSubmittable(true);
                return false;
            }
            setSubmittable(false);
            // get a reference to the file        
            const file = e.target.files[0];

            // encode the file using the FileReader API
            const reader = new FileReader();
            reader.onloadend = async () => {
                // use a regex to remove data url part
                let arr = base64Src;
                arr.push(reader.result);
                setBase64Src(arr);
                const base64String = reader.result;

                // log to console
                // logs wL2dvYWwgbW9yZ...
                setSelectedFile(base64String);
                let data = {
                    "image": base64String,
                    "folder": "post-images"
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
                        let arr = imgPathArr;
                        arr.push(res.data.imagepath);
                        setImgPathArr(arr);
                        setIsImgLoading(false);
                        setSubmittable(true);
                    }
                } catch {
                    console.log("some error occured");
                }
            };
            reader.readAsDataURL(file);
        };
    }
    //IN PROGRESS


    // UPDATES THE ACTIVECATEGORY
    const updateActiveCategory = (activeCat) => {
        setConfessions(false);
        setConfCount(1);
        setPageNo(1);
        setAC2(activeCat);
        setActiveCategory(`${activeCat}`);
    }



    //POSTS CONFESSION FROM FEED PAGE
    const postConfession = async () => {

        if (submittable) {

            updatePostBtn(true);

            let postConfessionArr,
                token = '',
                loggedInUserData,
                post_as_anonymous = 1,
                feedDescErrorCont = document.getElementById("responseCont"),
                feedPostConfResponseCont = feedDescErrorCont,
                description = document.getElementById("description");

            let recapToken = ""

            window.grecaptcha.ready(() => {
                window.grecaptcha.execute("6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt", { action: 'submit' }).then(token => {
                    recapToken = token;
                    executePostConfession();
                });
            });

            const executePostConfession = async () => {

                if (description.value.trim() !== '') {
                    feedDescErrorCont.innerText = "";
                    if (auth()) {
                        loggedInUserData = localStorage.getItem("userDetails");
                        loggedInUserData = JSON.parse(loggedInUserData);
                        post_as_anonymous = loggedInUserData.profile.post_as_anonymous;
                        token = loggedInUserData.token;
                        recapToken = "";
                    }
                    else if (recapToken === '') {
                        updatePostBtn(false);
                        feedDescErrorCont.innerText = "Recaptcha is required";
                        return false;
                    }

                    if (selectedCat === '') {
                        updatePostBtn(false);
                        setIsLoading(false);
                        setErrorOrSuccess(false);
                        feedDescErrorCont.innerText = "Please select a category";
                        return false;
                    }

                    if (auth() && post_as_anonymous === 0) {
                        if (postAlertReducer.postAnyway === false) {
                            dispatch(postAlertActionCreators.openModal());
                            updatePostBtn(false);
                            setIsLoading(false);
                            return false;
                        }
                    }

                    postConfessionArr = {
                        "description": description.value,
                        "category_id": selectedCat,
                        "post_as_anonymous": post_as_anonymous,
                        "image": JSON.stringify(imgPathArr),
                        "code": token === '' ? recapToken : ''
                    };

                    //PRIVAY MODAL :: RUNS IF NOT AUTHENTICATED
                    if (!auth()) {
                        if (localStorage.getItem("privacyAccepted") ? (parseInt(localStorage.getItem("privacyAccepted")) !== 1 ? true : false) : true) {
                            setPrivacyModal({ ...privacyModal, isConfessionBeingPost: true, visible: true })
                            updatePostBtn(false);
                            setIsLoading(false);
                            return false;
                        }
                    }

                    let obj = {
                        data: postConfessionArr,
                        token: token,
                        method: "post",
                        url: "createconfession"
                    }

                    setIsLoading(true);

                    try {
                        const response = await fetchData(obj);
                        if (response.data.status === true) {
                            feedDescErrorCont.innerText = "";
                            setErrorOrSuccess(true);
                            description.value = '';
                            setSelectedCat("");
                            getConfessions(false, activeCategory, 1);
                            feedPostConfResponseCont.innerHTML = response.data.message;
                            if (base64Src.length) setBase64Src([])
                            if (imgPathArr) setImgPathArr([])
                        } else {
                            setErrorOrSuccess(false);
                            feedPostConfResponseCont.innerHTML = response.data.message;
                        }

                        updatePostBtn(false);
                        setIsLoading(false);
                        setSelectedCat("");
                        //RESETS THE SELECT BOX
                        let selectRef = document.querySelector('#selectedCategory');
                        selectRef.selectedIndex = 0;

                        setTimeout(() => {
                            feedPostConfResponseCont.innerHTML = "";
                        }, 2000);

                    } catch (err) {
                        console.log(err);
                        setErrorOrSuccess(false);
                        updatePostBtn(false);
                        setIsLoading(false);
                        setSelectedCat("");
                        let selectRef = document.querySelector('#selectedCategory');
                        selectRef.selectedIndex = 0;
                        feedPostConfResponseCont.innerHTML = "Server Error, Please try again after some time...";
                    }

                    if (postAlertReducer.visible === true)
                        dispatch(postAlertActionCreators.closeModal());


                    if (postBoxStateReducer.description !== '' || postBoxStateReducer.selectedCat !== '')
                        dispatch(setPostBoxState({ feed: { description: '', selectedCat: '' } }));

                }
                else {
                    feedDescErrorCont.innerText = "Comment field is required";
                    setErrorOrSuccess(false);
                    updatePostBtn(false);
                    setIsLoading(false);
                }
            }
        }
    }

    const updatePostBtn = bool => {
        let ref = document.getElementById('postConfessionBtn');
        if (bool) return ref.classList.add('disabled');
        ref.classList.remove('disabled');
    }


    //PREVENTS DOUBLE POST
    // const postConfession = _.debounce(_postConfession, 200);

    const fetchMoreData = () => {
        let page = pageNo;
        page = parseInt(page) + 1;
        setPageNo(page);
    }


    //HITS API TO GET CONFESSIONS
    useEffect(() => {
        destroySlots();
        getConfessions(false, activeCategory, 1);
        setAC2(activeCategory)
        // console.log({ activeCategory })
        setPageNo(1);
    }, [activeCategory])


    useEffect(() => {
        if (pageNo !== 1) {
            getConfessions(true, activeCategory, pageNo);
        }
    }, [pageNo])


    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {
        const scroll = () => {
            let scroll = document.querySelector("html").scrollTop;
            let secondPostElem = document.querySelector(".postCont:nth-child(1)")
            secondPostElem = secondPostElem?.getBoundingClientRect()?.top + 500
            if (secondPostElem < 0) heartCompRef?.current.classList.remove("hideHeartComp")
            else heartCompRef?.current.classList.add("hideHeartComp")
        }

        document.addEventListener("scroll", scroll);
        return () => {
            document.removeEventListener("scroll", scroll);
        }
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
        const firstPost = document.querySelector('.postCont[index="0"]')
        if (firstPost) {
            firstPost.scrollIntoView({
                block: "center",
                // behavior: "smooth"
            })
        }
    }


    //DESTROYS SLOTS CREATED FOR ADS
    const destroySlots = () => {
        window.googletag = window.googletag || { cmd: [] };
        if (window.googletag.destroySlots) {
            window.googletag.destroySlots();
        }
    }

    // Open share iwth love modal
    const openSharewithLoveModal = () => {
        dispatch(toggleShareWithLoveModal({
            visible: true
        }))
    }

    //DELAY
    const openFeaturesDelay = () => {
        setTimeout(() => {
            openFeatures();
        }, 60 * 1000)
    }

    // REFRESH FEED
    const refreshFeed = async () => {
        goUp()
        await new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 200)
        })
        if (activeCategory === "all") return getConfessions(false, "all", 1)
        setActiveCategory('all')
    }


    return (
        <div className="container-fluid feed_page">
            {commentsModalReducer.visible && <CommentGotModal
                handleChanges={handleChanges}
                updateConfessionData={updateConfessionData}
                updatedConfessions={updatedConfessions}
                state={commentsModal}
                handleCommentsModal={handleCommentsModal} />}
            <div className="row outerContWrapper">

                <Header links={true} refreshFeed={refreshFeed}></Header>

                <div className="leftColumn leftColumnFeed">
                    <div className="leftColumnWrapper">
                        <AppLogo />

                        <div className="middleContLoginReg feedMiddleCont">
                            {/* CATEGORYCONT */}
                            <aside className="posSticky">
                                <Category
                                    showConfessionCats={true}
                                    categories={props.categories}
                                    activeCatIndex={AC2S}
                                    updateActiveCategory={updateActiveCategory}
                                />
                            </aside>
                            {/* CATEGORYCONT */}
                        </div>

                        {/* <div className="leftSidebarAdd">
                            <LeftSideAdComp />
                        </div> */}


                        {/* SOCIAL LINKS PANEL */}
                        <div className="leftSidebarFooter">
                            <div className='categoryHead pb-1'>
                                Follow us on
                            </div>
                            <div className='socialLinksIconWrapperFeed'>
                                <ul>
                                    <li pulsate='07-07-22,pulsatingIcon social'>
                                        <a target="blank" href="https://www.facebook.com/TheTalkPlaceOfficial">
                                            <img src={fbSocial} alt="fbSocialIcon" />
                                        </a>
                                    </li>
                                    <li pulsate='07-07-22,pulsatingIcon social'>
                                        <a target="blank" href="http://twitter.com/the_talkplace">
                                            <img src={TwitterSocial} alt="TwitterSocialIcon" />
                                        </a>
                                    </li>
                                    <li pulsate='07-07-22,pulsatingIcon social'>
                                        <a target="blank" href="https://www.instagram.com/the_talkplace_official/">
                                            <img src={instaSocial} alt="instaSocialIcon" />
                                        </a>
                                    </li>
                                    <li pulsate='07-07-22,pulsatingIcon social'>
                                        <a target="blank" href="http://TikTok.com/@the_talkplace">
                                            <img src={tiktokSocial} alt="tiktokSocialIcon" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* SOCIAL LINKS PANEL */}
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
                                                <div className="doCommentTitle">
                                                    Share your true feelings. Or your Confessions.
                                                    Safely connect with like minds. Get answers to questions.
                                                    You are Anonymous
                                                </div>
                                                <div className="confessImgContInCaptha">
                                                    <img src={confessionBanner} alt="" />
                                                </div>
                                            </div>
                                            <div className="postBody">
                                                <div className="container-fluid inputWithForwardCont">
                                                    <div className="col-12 inputToAddComment toDoinputToAddComment">
                                                        <TextareaAutosize
                                                            className="form-control"
                                                            id="description"
                                                            minRows={5}
                                                            maxLength={noOfChar}
                                                            defaultValue={postBoxStateReducer.description ?? ""}
                                                            placeholder={"What’s REALLY on your mind?"}
                                                        ></TextareaAutosize>
                                                        <span className="textAreaLimit">[ Max-Characters:{noOfChar} ]</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="postFoot createConfFeedPostFoot">
                                                <div className="recaptchaFeed feed w-100">

                                                    <div className="selectNpostBtnCont">
                                                        <div className="shareIconAndUpImgCont">
                                                            <div
                                                                pulsate='28-10-22,pulsatingIcon mobile'
                                                                className="heartCompCont hideHeartComp cursor_pointer"
                                                                onClick={openSharewithLoveModal}
                                                                ref={heartCompRef}>
                                                                <HeartComponent />
                                                            </div>

                                                            <div className="wrapperBtnsImages">
                                                                {/* Upload images cont */}
                                                                <div className={`cstmUploadFileCont feedPage ${base64Src.length > 0 ? "feedMb15" : ""}`}>
                                                                    <div className="uploadImgFeedCont">
                                                                        <label htmlFor="uploadImages" className="uploadImgWrapper">
                                                                            <img src={uploadImages} alt="" className='mr-0' />
                                                                        </label>
                                                                        <input
                                                                            type="file"
                                                                            className="form-control-file"
                                                                            id="uploadImages"
                                                                            accept=".jpg, jpeg, .gif, .png"
                                                                            name="images"
                                                                            onChange={(e) => { toBase64(e) }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* Upload images cont */}

                                                                {/* End of upload images preview container for web */}
                                                                {base64Src.length > 0 &&
                                                                    <div className="createPostImgPrev feed">
                                                                        <div className="form-group imgPreviewCont feed">
                                                                            <div className="imgContForPreviewImg feed">
                                                                                {base64Src.map((elem, index) => {
                                                                                    return (<span className="uploadeImgWrapper feed" key={"imgPreviewCont9" + index} value={index} onClick={() => { removeImg(index) }}>
                                                                                        <img src={elem.toString()} alt="" className='previewImg' />
                                                                                        <img src={removeImgIcon} alt="" className='removeImgIcon' type="button" />
                                                                                    </span>)
                                                                                })}

                                                                                {isImgLoading &&
                                                                                    <div className="imgLoader feed">
                                                                                        <div className="spinner-border pColor imgLoaderInner" role="status">
                                                                                            <span className="sr-only">Loading...</span>
                                                                                        </div>
                                                                                    </div>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {/* End of upload images preview container for web */}
                                                            </div>
                                                        </div>

                                                        {/* Select cat.. and post btns cont */}
                                                        <div className="feedSPbtnsWrapper">

                                                            <div className="form-group createPostInputs createInputSelect mb-0">
                                                                <select
                                                                    className="form-control"
                                                                    onChange={(e) => setSelectedCat(e.target.value)}
                                                                    id="selectedCategory"
                                                                    defaultValue={selectedCat}
                                                                    name="category">
                                                                    <option value={""}>Select Category </option>

                                                                    {/* ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}
                                                                    {props.categories ? props.categories.map((element) => {
                                                                        if (element?.is_confession !== 1) return
                                                                        return <option key={`createPost ${element.id}`} value={element.id}>{(element.category_name).charAt(0) + (element.category_name).slice(1).toLowerCase()}</option>
                                                                    }) : <option value="">Categories not found</option>}
                                                                    {/* END OF ADDS CATEGORIES TO THE SELECT BOX AS OPTIONS */}

                                                                </select>
                                                                <img src={downArrowIcon} alt="" type="button" onClick={openSelect} />
                                                                <span className="d-block errorCont text-danger" id="catErrorCont"></span>
                                                            </div>

                                                            <div className="doPostBtn" type="button" id="postConfessionBtn" onClick={() => {
                                                                if (isLoading === false)
                                                                    postConfession()
                                                            }}>
                                                                <div className="">
                                                                    {isLoading === true
                                                                        ?
                                                                        <div className="spinner-border whiteSpinner  spinnerSizeFeed" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                        :
                                                                        "Post"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="w-100 errorFieldsCPost p-0">
                                                    <div className={`responseCont mt-0 ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="responseCont"></div>
                                                    <span className="d-block errorCont text-danger" id="descErrorCont"></span>
                                                    <span className="errorCont text-danger" id="catErrorCont"></span>
                                                </div>
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
                                                            return (<div key={`fConf${index}`}>
                                                                <Post
                                                                    index={index}
                                                                    cover_image={post.cover_image ?? ''}
                                                                    is_viewed={post.is_viewed}
                                                                    isRegistered={post.isRegistered}
                                                                    isReported={post.isReported}
                                                                    updateCanBeRequested={updateCanBeRequested}
                                                                    viewcount={post.viewcount}
                                                                    handleCommentsModal={handleCommentsModal}
                                                                    updateConfessionData={updateConfessionData}
                                                                    slug={post.slug}
                                                                    createdAt={post.created_at}
                                                                    post_as_anonymous={post.post_as_anonymous}
                                                                    curid={post.user_id === '0' ? false : post.user_id}
                                                                    category_id={post.category_id} profileImg={post.profile_image}
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

                                                                {((index + 1) % afterHowManyShowAdd === 0) &&
                                                                    <div className="mb-4">
                                                                        <AdMob mainContId={`adIndex${index}`} setAddSlots={setAdSlots} slots={adSlots} />
                                                                    </div>
                                                                }
                                                            </div>)
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

                <div className="rightsideBarAdd">
                    <RightSideAdComp />
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


                <Footer refreshFeed={refreshFeed} />
                {/* <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i> */}
                {/* <i
                    ref={goDownArrowRef}
                    className={`fa fa-refresh goUpArrow refreshIcon`}
                    aria-hidden="true"
                    type="button"
                    onClick={refreshFeed}></i> */}

                {/* REFRESH BUTTON */}
                {commentsModal.visibility === false && changes && <RefreshButton />}

            </div >

            {
                friendReqModalReducer.visible === true &&
                <>
                    <FriendReqModal
                        changeCancelled={changeCancelled}
                        closeFrReqModalFn={closeFRModal}
                        toggleLoadingFn={toggleLoadingFn}
                        changeRequested={changeRequested}
                        _updateCanBeRequested={updateCanBeRequested}
                    />
                </>
            }

            {
                (document.querySelector('#description') && document.querySelector('#description').value !== '' && postAlertReducer.visible === true) &&
                <>
                    <PostAlertModal
                        data={{ feed: { selectedCat, description: document.querySelector('#description').value } }}
                        postConfession={postConfession}
                    />
                </>
            }

            {/* Appriciation Modal */}
            <AppreciationModal />
            {/* Appriciation Modal */}

            {/* ReportCommentModal */}
            {reportModalReducer.visible && <ReportCommentModal />}
            {/* ReportCommentModal */}

            {/* ReportPostsModal */}
            {
                reportPostModalReducer.visible && (
                    <ReportPostModal
                        updatedConfessions={updatedConfessions} />)
            }
            {/* ReportPostsModal */}

            {/* Avatar intro modal */}
            {<AvatarsIntroModal />}
            {/* Avatar intro modal */}

            <ShareWithLoveModal getConfessions={getConfessions} />
        </div >
    );
}
