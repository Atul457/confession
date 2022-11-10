import React, { useState, useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Category from '../../components/Category';
import { Link, useLocation } from "react-router-dom";
import SiteLoader from "../../components/SiteLoader";
import { useNavigate } from "react-router-dom";
import Lightbox from "react-awesome-lightbox";
import { fetchData } from '../../../../commonApi';
import "react-awesome-lightbox/build/style.css";
import { useParams } from "react-router-dom";
import logo from '../../../../images/appLogo.svg'
import { openCModal as openCommentsModalFn } from '../../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../../../../helpers/getToken';
import ReportPostModal from '../../Modals/ReportPostModal';
import ReportCommentModal from '../../Modals/ReportCommentModal';
import ConfessionDetailPage from '../../Modals/ConfessionDetailPage';
import { apiStatus } from '../../../../helpers/status';



export default function CommentsGot(props) {

    const params = useParams();
    const location = useLocation()
    let history = useNavigate();
    const dispatch = useDispatch();
    const [comDetailPage, setComDetailPage] = useState({
        status: apiStatus.LOADING,
        message: "",
        data: {},
        props: {}
    })
    const {
        reportPostModalReducer,
        reportComModalReducer: reportModalReducer
    } = useSelector(state => state);
    const [confessionData, setConfessionData] = useState(false);
    const [lightBox, setLightBox] = useState(false);
    const [activeCat, setActiveCat] = useState(false);
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

    const updateConf = (dataToUpdate) => {
        updatePost(dataToUpdate)
    }

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
    const updateActiveCategory = (activeCat) => {
        history(`/home`, { state: { active: activeCat } });
    }

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
        <div className="container-fluid">

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
                            <div className="py-md-4 preventFooter w-100">
                                <div className="row forPosSticky">

                                    {/* MIDDLECONTAINER */}

                                    {comDetailPage.status === apiStatus.LOADING
                                        ?
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
                                                <section className="col-lg-12 col-12 px-md-4 px-0">
                                                    <div className='w-100 mb-3'>

                                                        <Link to={`/${location?.state?.cameFromSearch ? "search" : "home"}`} className='backtoHome'>
                                                            <span className='mr-2'>
                                                                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                                            </span>
                                                            {location?.state?.cameFromSearch === true ? "Go back to search" : "Go back to home"}
                                                        </Link>

                                                    </div>
                                                    <ConfessionDetailPage
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
                        updatedConfessions={updateConf} />)
            }
            {/* ReportPostsModal */}

            {/* ReportCommentModal */}
            {reportModalReducer.visible && <ReportCommentModal />}
            {/* ReportCommentModal */}

        </div>
    );
}
