import React, { useState, useEffect } from 'react';
import Header from './common/Header';
import Comments from '../pageElements/Comments';
import Category from './Categories';
import Footer from './common/Footer';
import userIcon from '../../images/userAcc.png';
import auth from '../behindScenes/Auth/AuthCheck';
import { Link } from "react-router-dom";
import SiteLoader from "../../user/pageElements/components/SiteLoader";
import { useNavigate } from "react-router-dom";
import Lightbox from "react-awesome-lightbox";
import { fetchData } from '../../commonApi';
import "react-awesome-lightbox/build/style.css";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    useParams
} from "react-router-dom";
import ConfessionDetailPageAdmin from './modals/ConfessionDetailPageAdmin';
import { apiStatus } from '../../helpers/status';
import ForumLayoutWrapperAdmin from '../components/forums/common/ForumLayoutWrapperAdmin';
import { getAdminToken } from '../../helpers/getToken';
import { openCModal as openCommentsModalFn } from '../../redux/actions/commentsModal';
import { useDispatch } from 'react-redux';


export default function CommentsGot(props) {

    const params = useParams();
    if (!auth()) {
        window.location.href = "/talkplacepanel"
    }

    let history = useNavigate();
    const dispatch = useDispatch()

    //LOGOUT
    const logout = () => {
        localStorage.removeItem("adminDetails");
        localStorage.removeItem("adminAuthenticated");
        window.location.href = "/talkplacepanel"
    }
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [comDetailPage, setComDetailPage] = useState({
        status: apiStatus.LOADING,
        message: "",
        data: {},
        props: {}
    })
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("adminDetails")) : '');
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
    const [commentsCount, setCommentsCount] = useState(0);
    const [categories, setCategories] = useState({
        isLoading: true,
        isError: false,
        data: []
    });
    const [loaded, setLoaded] = useState(false)
    const [reqFulfilled, setReqFullfilled] = useState(false);

    const updatePost = (dataToUpdate) => {
        setComDetailPage({
            ...comDetailPage,
            props: {
                ...comDetailPage.props,
                ...dataToUpdate
            }
        })
    }
    const [token] = useState(() => {
        if (auth()) {
            let details = localStorage.getItem("adminDetails");
            if (details) {
                details = JSON.parse(details);
                return details.token;
            } else {
                logout();
            }
        } else {
            logout();
        }
    });

    useEffect(() => {
        async function getData() {

            let obj = {
                token: token,
                data: {},
                method: "post",
                url: "admin/getcategories"
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    setCategories({
                        isLoading: false,
                        isError: false,
                        data: res.data.categories
                    })
                } else {
                    setCategories({
                        ...categories,
                        isLoading: false,
                        isError: true,
                        message: res.data.message
                    })
                }
            } catch {
                setCategories({
                    ...categories,
                    isLoading: false,
                    isError: true,
                    message: ""
                })
            }
        }

        getData();
    }, [])

    // HANDLES SCROLL TO TOP BUTTON
    useEffect(() => {

        const listner = () => {
            let scroll = document.querySelector("html").scrollTop;
            if (scroll > 1000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        }

        document.addEventListener("scroll", listner)

        return () => {
            document.removeEventListener("scroll", listner)
        }
    }, [])


    //SCROLLS TO BOTTOM
    const goUp = () => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }


    useEffect(() => {
        window.scrollTo(0, 0);
        const getConfession = async () => {
            let obj = {
                data: {},
                token: "",
                method: "get",
                url: `getconfession/${params.postId}`
            }
            try {
                const response = await fetchData(obj)
                if (response.data.status === true) {
                    setConfessionData(response.data.confession);
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


    const openCommentsModal = () => {
        dispatch(openCommentsModalFn({
            "postId": confessionData.confession_id,
            "viewcount": confessionData.viewcount,
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



    async function getConfession() {

        let token;
        token = getAdminToken();

        let obj = {
            data: {},
            token: "",
            method: "get",
            url: `getconfession/${params.postId}`
        }

        setComDetailPage({
            ...comDetailPage,
            status: apiStatus.LOADING
        })

        try {
            const response = await fetchData(obj)
            if (response.data.status === true) {

                let activeCategory = response.data.confession.category_id;
                setActiveCat(activeCategory);
                setConfessionData(response.data.confession);

                const confRes = response.data.confession

                setComDetailPage({
                    ...comDetailPage,
                    status: apiStatus.FULFILLED,
                    data: response.data.confession,
                    props: {
                        "postId": confRes?.confession_id,
                        "viewcount": confRes?.viewcount,
                        "visibility": true,
                        "index": 0,
                        "userName": confRes?.userName,
                        "postedComment": confRes?.description,
                        "category_id": confRes?.category_id,
                        "category_name": confRes?.category_name,
                        "confession_id": confRes?.confession_id,
                        "created_at": confRes?.created_at,
                        "created_by": confRes?.created_by,
                        "description": confRes?.description,
                        "no_of_comments": confRes?.no_of_comments,
                        "post_as_anonymous": confRes?.post_as_anonymous,
                        "profile_image": confRes?.profile_image,
                        "user_id": confRes?.user_id === '0' ? false : confRes?.user_id,
                        "image": confRes?.image === '' ? '' : confRes?.image,
                        "isNotFriend": confRes?.isNotFriend,
                        "is_viewed": confRes?.is_viewed,
                        "updatedConfessions": () => { },
                        "like": confRes?.like,
                        "slug": confRes?.slug,
                        "is_liked": confRes?.is_liked,
                        "isReported": confRes?.isReported,
                        "dislike": confRes?.dislike,
                        "is_liked_prev": confRes?.is_liked,
                        "cover_image": confRes?.cover_image,
                        "updateConfessionData": updateConfessionData,
                        "updatePost": updatePost
                    }
                })
                return setLoaded(true);
            } else {
                if ("newslug" in response.data) {
                    const linkToRedirect = `/confession/${response.data?.newslug}`
                    return history(linkToRedirect)
                }

                setComDetailPage({
                    ...comDetailPage,
                    status: apiStatus.REJECTED,
                    message: response?.message ?? "Something went wrong"
                })
            }

            //Handles app in case of no api response

            setConfessionData(true);
            setLoaded(false);

        } catch (err) {
            console.log({ err })
            setConfessionData(true);
            setLoaded(false);
            setComDetailPage({
                ...comDetailPage,
                status: apiStatus.REJECTED,
                message: err?.message ?? "Something went wrong"
            })
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
    // const updateActiveCategory = (activeCat) => {
    //     history(`/home`, { state: { active: activeCat } });
    // }

    // UPDATES THE CONFESSION DATA ON THE COMMENTS GOT PAGE
    function updateConfessionData(data, dataToUpdate) {

        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = { ...confessionData };
        updatedConfessionNode = updatedConfessionArray;
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray = updatedConfessionNode;
        updatePost(updatedConfessionNode)
    }


    return (
        <ForumLayoutWrapperAdmin>
            <div className="container-fluid px-0">
                {(auth() && confessionData)
                    ?
                    <div className="row">
                        <Header links={true} />
                        {lightBox && (
                            confessionData.image && ((confessionData.image).length !== 0 && ((confessionData.image).length > 1
                                ?
                                (<Lightbox images={confessionData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                                :
                                (<Lightbox image={confessionData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                        )}

                        {/* MIDDLECONTAINER */}

                        {comDetailPage.status === apiStatus.LOADING ?
                            <div className="text-center">
                                <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            :
                            (comDetailPage.status === apiStatus.REJECTED
                                ?
                                <div className="alert alert-danger w-100" role="alert">
                                    {comDetailPage.message}
                                </div>
                                :
                                (
                                    <section className="col-lg-12 col-12 px-md-4 px-3">
                                        <div className='w-100 mb-3'>

                                            <Link to={`/dashboard`} className='backtoHome'>
                                                <span className='mr-2'>
                                                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                </span>
                                                Go back to confessions
                                            </Link>

                                        </div>
                                        <ConfessionDetailPageAdmin
                                            updatePost={updatePost}
                                            handleChanges={() => { }}
                                            updateConfessionData={() => { }}
                                            updatedConfessions={() => { }}
                                            state={comDetailPage?.data}
                                            comDetailPage={comDetailPage}
                                            categories={props.categories}
                                            handleCommentsModal={() => { }}
                                        />
                                    </section>
                                )
                            )}

                        {/* MIDDLECONTAINER */}

                        <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
                        <Footer />
                    </div>
                    :
                    <div className="text-center w-100">
                        <div className="spinner-border text-warning pColor" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}

            </div>
        </ForumLayoutWrapperAdmin>
    );
}
