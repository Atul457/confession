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


export default function CommentsGot(props) {

    const params = useParams();
    if (!auth()) {
        window.location.href = "/talkplacepanel"
    }

    let history = useNavigate();

    //LOGOUT
    const logout = () => {
        localStorage.removeItem("adminDetails");
        localStorage.removeItem("adminAuthenticated");
        window.location.href = "/talkplacepanel"
    }
    const [goDownArrow, setGoDownArrow] = useState(false);
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
        document.addEventListener("scroll", () => {
            let scroll = document.querySelector("html").scrollTop;
            if (scroll > 1000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        })
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


    const commentsOnCconfession = async (page = 1, append = false) => {
        let pageNo = page;
        let data = {
            "confession_id": params.postId,
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
    }, [])


    // TAKES YOU TO THE HOME PAGE, AND LOADS THE ACTIVECAT CONFESSION DATA
    const updateActiveCategory = (activeCat) => {
        history(`/dashboard`, { state: { active: activeCat } });
    }


    const fetchMoreComments = () => {
        commentsOnCconfession((commentsData.page + 1), true);
    }


    // UPDATES THE COMMENTS
    const updateComments = (commentId) => {
        setCommentsCount((prevState)=>prevState - 1);
        let newCommentsArr = commentsArr.filter((current)=>{
            if (commentId !== current.comment_id)
            {
                return current;
            }
        })

        setCommentsArr(newCommentsArr);
        setSharedBy((prevState)=>prevState-1);
    }


    return (
        <div className="container-fluid">
            { (auth() && confessionData)
                ?
                <div className="row">
                    <Header links={true} />
                    <div className="preventHeader">preventHead</div>
                    {lightBox && (
                        confessionData.image && ((confessionData.image).length !== 0 && ((confessionData.image).length > 1
                            ?
                            (<Lightbox images={confessionData.image} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
                            :
                            (<Lightbox image={confessionData.image} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
                    )}
                    <div className="container py-md-4 px-md-5 p-3 preventFooter">
                        <div className="row forPosSticky">

                            <section className="col-lg-12 col-12 mt-3 mt-lg-0">
                                <div className="postsMainCont">

                                    <div className="row mx-0">
                                        {/* CATEGORYCONT */}
                                        <aside className="col-12 col-md-4 posSticky">
                                            <Category editVisible={false} activeCatIndex={activeCat} categories={categories} updateActiveCategory={updateActiveCategory} />
                                        </aside>
                                        {/* CATEGORYCONT */}

                                        {/* MIDDLECONTAINER */}

                                        {isWaitingRes
                                            ?
                                            <section className="col-md-8 col-12 mt-3 mt-lg-0">
                                                <div className="spinner-border pColor spinnerSizeFeed" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </section>
                                            :
                                            (isServerErr
                                                ?
                                                (<section className="col-md-8 col-12 pt-1 mt-lg-0">
                                                    <div className="alert alert-danger" role="alert">
                                                        Server Error.. Please try again
                                                    </div>
                                                </section>)
                                                :
                                                (
                                                    <section className="col-md-8 col-12 mt-3 mt-lg-0">
                                                        {isValidPost ? <div className="postCont">
                                                            <div className="postContHeader justifyContentInitial">
                                                                <span className="userImage userImageFeed">
                                                                    <img ket={confessionData.profile_image + "1"} src={confessionData.profile_image === '' ? userIcon : confessionData.profile_image} className="userAccIcon" alt="" />
                                                                </span>
                                                                {confessionData.post_as_anonymous === 1
                                                                    ? <span className="userName">
                                                                        {confessionData.created_by}
                                                                    </span> :
                                                                    <Link className={`textDecNone `}
                                                                        to={confessionData.post_as_anonymous === 0 &&
                                                                            (auth() ? (userDetails.profile.user_id === confessionData.user_id ? `/profile` : `/userProfile/${confessionData.user_id}`) : `/userProfile?user=${confessionData.user_id}`)
                                                                        }>
                                                                        <span className="userName">
                                                                            {confessionData.post_as_anonymous === 1 ? "Anonymous ." : confessionData.created_by}
                                                                        </span>
                                                                    </Link>}


                                                                <span className="catCommentBtnCont">
                                                                    <div className="categoryOfUser" type="button">{(confessionData.category_name).charAt(0) + (confessionData.category_name).slice(1).toLowerCase()}</div>
                                                                </span>
                                                                <span className="postCreatedTime">
                                                                    {confessionData.created_at}
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
                                                                            <div className="imgContForPreviewImg" type="button" onClick={() => { setLightBox(true) }} >
                                                                                {(confessionData.image).map((src) => {
                                                                                    return <img
                                                                                        key={src + "imgContForPreviewImg"} src={src}
                                                                                        alt="" />

                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )

                                                                }
                                                                <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>
                                                            </div>

                                                            <div className="postFoot w-100 d-flex">
                                                                <div className="totalComments">
                                                                    {sharedBy}  - People shared their thoughts about this post
                                                                </div>
                                                            </div>
                                                        </div>
                                                            :
                                                            <div className="alert alert-danger" role="alert">
                                                                The post doesn't exists
                                                            </div>}

                                                        {isValidPost && <div className="postsMainCont">
                                                            {commentsArr.length > 0
                                                                &&
                                                                <InfiniteScroll
                                                                    endMessage={<div className="text-center endListMessage mt-4 pb-3">End of Comments</div>}
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
                                                                            comment_id = {post.comment_id}
                                                                            created_at ={post.created_at}
                                                                            curid={(post.user_id === '' || post.user_id === 0) ? false : post.user_id}
                                                                            key={"Arr" + index + "dp"}
                                                                            imgUrl={post.profile_image} userName={post.comment_by}
                                                                            postedComment={post.comment} />

                                                                    })}
                                                                </InfiniteScroll>
                                                            }

                                                        </div>}

                                                    </section>
                                                )
                                            )}

                                        {/* MIDDLECONTAINER */}
                                    </div>

                                </div>
                            </section>
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
