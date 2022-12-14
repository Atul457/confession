import React, { useEffect, useState } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import userIcon from '../../../../images/userAcc.png';
import { useParams } from 'react-router';
import auth from '../../../behindScenes/Auth/AuthCheck';
import SiteLoader from '../../components/SiteLoader';
import Post from '../../components/Post';
import alRequest from '../../../../images/addFriendIconP.png';
import rejectRequest from '../../../../images/friendsAl.png';
import verifiedIcon from '../../../../images/verifiedIcon.svg';
import { fetchData } from '../../../../commonApi';
import InfiniteScroll from "react-infinite-scroll-component";
import AppLogo from '../../components/AppLogo';
import { useSelector } from 'react-redux';
import ReportCommentModal from '../../Modals/ReportCommentModal';
import ReportPostModal from '../../Modals/ReportPostModal';
import Badge from '../../../../common/components/badges/Badge';
import { getKeyProfileLoc } from '../../../../helpers/profileHelper';


export default function UserProfile() {

    // Hooks and vars
    const params = useParams();
    const [profile, setProfile] = useState({
        isProfileLoading: true, isProfileErr: false,
        profileData: { page: 1, profile_id: params.userId },
        profileDetails: false
    })
    const { reportPostModalReducer } = useSelector(state => state)
    const [conf, setConf] = useState({
        isConfLoading: true, isConfErr: false,
        confData: { token: '', profile_id: params.userId },
        confDetails: false
    })
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [confCount, setConfCount] = useState(0);
    const [confPage, setConfPage] = useState(1);

    // Functions

    // Gets profile data
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        async function getData() {
            let data = { profile_id: profile.profileData.profile_id };


            let obj = {
                data: data,
                token: getKeyProfileLoc("token", true) ?? "",
                method: "post",
                url: "getotherprofile"
            }

            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    setProfile({
                        ...profile,
                        "isProfileLoading": false,
                        "isProfileErr": false,
                        "profileDetails": res.data.profile,
                    });
                } else {
                    setProfile({
                        ...profile,
                        "isProfileLoading": false,
                        "isProfileErr": false,
                        "message": res.data.message
                    });
                }
            } catch {
                setProfile({
                    ...profile,
                    "isProfileLoading": false,
                    "isProfileErr": true,
                });
            }
        }

        getData();
    }, [])

    // Handles scroll to top button
    useEffect(() => {
        const handleArrow = () => {
            let scroll = document.querySelector("html").scrollTop;
            if (scroll > 1000) {
                setGoDownArrow(true);
            } else {
                setGoDownArrow(false);
            }
        }

        document.addEventListener("scroll", handleArrow)

        return () => {
            document.removeEventListener("scroll", handleArrow)
        }
    }, [])


    // Scrolls to top
    const goUp = () => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }

    // Fetches the confessions of the user, whose profile is visited
    async function getConfessionsFunc(page = 1, append = false) {

        let pageNo = page;
        let data = {
            profile_id: profile?.profileDetails?.profile_id,
            page: pageNo
        }

        let obj = {
            data: data,
            token: getKeyProfileLoc("token", true),
            method: "post",
            url: "getmyconfessions"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                if (append === true) {
                    let newConf = [...conf.confDetails, ...res.data.confessions];
                    setConf({
                        ...conf,
                        "isConfLoading": false,
                        "isConfErr": false,
                        "confDetails": newConf
                    });
                    setConfPage(pageNo);
                } else {
                    setConfCount(res.data.count);
                    setConf({
                        ...conf,
                        "isConfLoading": false,
                        "isConfErr": false,
                        "confDetails": res.data.confessions,
                    });
                }

            } else {
                setConf({
                    ...conf,
                    "isConfLoading": false,
                    "isProfileErr": true,
                    "message": res.data.message
                });
            }
        } catch {
            setConf({
                ...conf,
                "isConfLoading": false,
                "isConfErr": true,
            });
        }
    }

    // Gets confessions
    useEffect(() => {
        if (profile.profileDetails?.profile_id)
            getConfessionsFunc();
    }, [profile.profileDetails?.profile_id])


    // Sends friend request
    const sendFriendRequest = async (isCancelling = 0) => {
        console.log(profile.profileDetails)

        let data = {
            friend_id: profile.profileDetails?.profile_id,
            is_cancelled: isCancelling
        }

        let obj = {
            data: data,
            token: getKeyProfileLoc("token", true),
            method: "post",
            url: "sendfriendrequest"
        }

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                setProfile({
                    ...profile, "profileDetails":
                    {
                        ...profile.profileDetails,
                        is_requested: isCancelling === 1 ? 0 : 1
                    }
                });
            }
        } catch {
            console.log("Some error occured");
        }
    }


    const fetchMoreConfessions = () => {
        getConfessionsFunc((confPage + 1), true);
    }


    const updateConfessionData = (_viewcount, sharedBy, index) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        let shared = sharedBy;
        updatedConfessionArray = [...conf.confDetails];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            "no_of_comments": shared,
            "viewcount": _viewcount
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setConf({
            ...conf,
            "isConfLoading": false,
            "isConfErr": false,
            "confDetails": [...updatedConfessionArray]
        });
    }

    const updatedConfessions = (index, data) => {
        let updatedConfessionArray;
        let updatedConfessionNode;
        updatedConfessionArray = [...conf.confDetails];
        updatedConfessionNode = updatedConfessionArray[index];
        updatedConfessionNode = {
            ...updatedConfessionNode,
            ...data
        };
        updatedConfessionArray[index] = updatedConfessionNode;
        setConf({
            ...conf,
            "isConfLoading": false,
            "isConfErr": false,
            "confDetails": [...updatedConfessionArray]
        });
    }


    return (
        <div className="container-fluid toUp">

            {!profile.isProfileLoading ?
                <div className="row">
                    {/* {commentsModalReducer.visible && <CommentGotModal
                        handleChanges={handleChanges}
                        updateConfessionData={updateConfessionData}
                        updatedConfessions={updatedConfessions}
                        state={commentsModal}
                        handleCommentsModal={handleCommentsModal} />} */}

                    {/* Adds Header Component */}
                    <Header links={true} hideRound={true} propToWatch={conf.confDetails} />

                    <div className="leftColumn leftColumnFeed mypriflelocc profileSidebar">
                        <div className="leftColumnWrapper">
                            <AppLogo />

                            <div className="middleContLoginReg feedMiddleCont profile">
                                {/* CATEGORYCONT */}
                                <aside className="posSticky">

                                    <div className="profileDetailsCont">
                                        <span className='round11'>
                                            <span className='round22'>
                                                <span className='round33'>
                                                    <span className="profilePicCont">
                                                        <img
                                                            src={
                                                                profile.profileDetails.image === '' ?
                                                                    userIcon :
                                                                    profile.profileDetails.image}
                                                            alt=""
                                                            className="loggedInUserPic" />

                                                        {profile?.profileDetails?.email_verified === 1 ?
                                                            <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                                                    </span>


                                                </span>
                                            </span>
                                        </span>

                                        <span className="loggedInUserName mt-2">
                                            <span>
                                                {profile.profileDetails.name}
                                            </span>
                                            <Badge points={profile.profileDetails?.points} classlist="ml-2" />
                                        </span>

                                        {auth() && <>
                                            {
                                                //FRIENDS
                                                (profile.profileDetails.is_friend === 1) ?
                                                    <div type="button" className="form-group wProfile contantSupportCont d-flex">
                                                        <label className="profilePageLabels">You are now Friend With {profile.profileDetails.name}</label>
                                                    </div>
                                                    :
                                                    //NOT FRIENDS, REQUESTED
                                                    (profile.profileDetails.is_requested) ?

                                                        <div
                                                            type="button"
                                                            className="form-group wProfile contantSupportCont d-flex"
                                                            onClick={() => sendFriendRequest(1)}>
                                                            <label className="profilePageLabels">Cancel Request</label>
                                                            <span>
                                                                <img src={rejectRequest} alt="" className="callingImgProfile" />
                                                            </span>
                                                        </div>
                                                        :
                                                        //NOT REQUESTED
                                                        <div
                                                            type="button"
                                                            className="form-group wProfile contantSupportCont d-flex" onClick={() => sendFriendRequest(0)}>
                                                            <label className="profilePageLabels">Send Friend Request</label>
                                                            <span>
                                                                <img src={alRequest} alt="" className="callingImgProfile" />
                                                            </span>
                                                        </div>
                                            }
                                        </>}
                                        <div className="pt-0 otherProfileVerbiage my-2">
                                            * Only Public posts are shown here
                                        </div>
                                    </div>
                                    {/* edited */}
                                </aside>
                                {/* CATEGORYCONT */}
                            </div>
                        </div>
                    </div>

                    <div className="preventHeader profile">preventHead</div>
                    <div className="rightColumn rightColumnFeed rightColumnFeedppage profile">

                        <div className="roundCorners">__</div>
                        <div className="postsHeadingProfile">
                            {profile.profileDetails.name}'s Posts
                        </div>

                        <div className="thoughtsNrequestsCont container-fluid profile">
                            <div className="row w-100 mx-0">

                                <div className="col-12 container-fluid px-0">

                                    {/* Confessions */}
                                    {!conf.isConfErr
                                        ?
                                        (!conf.isConfLoading ? ((conf.confDetails && conf.confDetails.length) ?

                                            <InfiniteScroll
                                                endMessage={
                                                    <div className="endListMessage text-center mt-4 pb-3">
                                                        End of Confessions
                                                    </div>
                                                }
                                                dataLength={conf.confDetails.length}
                                                next={fetchMoreConfessions}
                                                hasMore={(conf.confDetails).length < confCount}
                                                loader={
                                                    <div className="w-100 text-center">
                                                        <div className="spinner-border pColor mt-4" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                {(conf.confDetails).map((post, index) => {
                                                    return <Post
                                                        isReported={post.isReported}
                                                        index={index}
                                                        cover_image={post.cover_image ?? ''}
                                                        slug={post.slug}
                                                        post_as_anonymous={false}
                                                        post={post}
                                                        viewcount={post.viewcount}
                                                        updateConfessionData={updateConfessionData}
                                                        createdAt={post.created_at}
                                                        updatedConfessions={updatedConfessions}
                                                        is_viewed={post.is_viewed}
                                                        like={post.like}
                                                        dislike={post.dislike}
                                                        is_liked={post.is_liked}
                                                        curid={null}
                                                        category_id={post.category_id}
                                                        key={index}
                                                        profileImg={profile.profileDetails.image}
                                                        postId={post.confession_id}
                                                        imgUrl={(post.image === '' || null) ? null : post.image}
                                                        userName={post.created_by}
                                                        category={post.category_name}
                                                        postedComment={post.description}
                                                        sharedBy={post.no_of_comments} />
                                                })}
                                            </InfiniteScroll>



                                            : <div className='endListMessage userProfileNoConf'>no confessons to show</div>)
                                            :
                                            (<div className="text-center">
                                                <div className="spinner-border pColor mt-4 text-center" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                            )) : <div className="alert alert-danger" role="alert">
                                            Unable to get confessions
                                        </div>}
                                    {/* End of Confessions */}

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REFRESH BUTTON */}

                    <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>

                    <Footer />
                </div>
                : <SiteLoader />}

            {/* ReportCommentModal */}
            <ReportCommentModal />
            {/* ReportCommentModal */}

            {/* ReportCommentModal */}
            {reportPostModalReducer.visible && (
                <ReportPostModal
                    updatedConfessions={updatedConfessions} />)
            }
            {/* ReportCommentModal */}
        </div>
    )
}
