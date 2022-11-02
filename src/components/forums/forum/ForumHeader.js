import React from 'react'
import { Link } from 'react-router-dom';

// Helpers
import DateConverter from '../../../helpers/DateConverter'

// Image imports
import actionIcon from '../../../images/actionIcon.svg';
import addFriend from '../../../images/addFriend.svg';
import reportForumIcon from "../../../images/reportForumIcon.svg";

// Redux
import { createForumModalFnAc, deleteForumAcFn, forumHandlers, reportForumAcFn, reqToJoinModalAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { useDispatch } from 'react-redux';
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc';

import { forum_types, reportedFormStatus, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import { apiStatus } from '../../../helpers/status';
import ShareKit from '../../../user/shareKit/ShareKit';
import auth from '../../../user/behindScenes/Auth/AuthCheck';

const ForumHeader = props => {

    // Hooks and vars
    const {
        name,
        category_name,
        is_only_to_show = false,
        created_at,
        currForum,
        isMyForumPage,
        shareBox,
        isCalledFromSearchPage = false,
        isMyForum = false,
        forum_index,
        actionBox,
        forum_id,
        type,
        is_requested,
        is_calledfrom_detailPage = false,
        isReported,
        is_for_post = true,
        scrollDetails
    } = props

    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const isShareBoxVisible = shareBox?.forum_id === forum_id && is_requested === requestedStatus.approved
    const dispatch = useDispatch()
    const hideJoinDiv = type === forum_types.closed || type === forum_types.public || is_requested === requestedStatus.approved
    const isNfswTypeContent = currForum?.is_nsw === 1
    const requested = is_requested === requestedStatus.is_requested
    const joined = currForum?.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const postData = { is_forum: 1, forum_id, ...currForum }
    const showShareBlock = type !== forum_types.closed && (isPrivateForum ? joined : true)

    // Functions
    const toggleForumAcboxFn = () => {
        let dataToSend = isActionBoxVisible ? {} : { forum_id, forum_index }
        dispatch(forumHandlers.handleForums({ actionBox: dataToSend, shareBox: {} }))
    }

    // Toggle action box
    const toggleAcBox = () => {
        toggleForumAcboxFn()
    }

    // Toggle share box
    const toggleShareBox = () => {
        let dataToSend = isShareBoxVisible ? {} : { forum_id, forum_index }
        dispatch(forumHandlers.handleForums({ shareBox: dataToSend, actionBox: {} }))
    }

    // Opens nfsw alert
    const openNsfwModal = () => {
        dispatch(toggleNfswModal({
            isVisible: true,
            forum_link: `/forums/${currForum?.slug}`,
            forum_id,
            forum_index
        }))
    }

    // Opens req to join modal
    const openReqToJoinModal = () => {
        dispatch(reqToJoinModalAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
                slug: currForum?.slug,
                requested: requested,
                is_calledfrom_detailPage,
                forum_index
            }
        }))
    }

    // Opens report forum modal
    const openReportModal = () => {
        dispatch(reportForumAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
                is_for_post,
                forum_index,
                isReported: isReported === reportedFormStatus.reported
            }
        }))
    }

    const deleteForum = () => {
        dispatch(deleteForumAcFn({
            visible: true,
            data: {
                forum_id,
                forum_index
            }
        }))
    }

    const openCreateSForumModal = () => {
        dispatch(createForumModalFnAc({
            visible: true,
            forum_details: currForum,
            isBeingEdited: true
        }))
    }

    const getBody = () => {
        const forum_slug = isCalledFromSearchPage && (isPrivateForum && !joined) ? "#" : (auth() ? `/forums/${currForum?.slug}` : "/login")

        if (auth() && isMyForum === false && ((isPrivateForum && !joined) || isNfswTypeContent))
            return (
                <div className="forum_header_left_sec" onClick={() => {
                    if ((isPrivateForum && !joined) && !isCalledFromSearchPage) return openReqToJoinModal()
                    if ((isPrivateForum && !joined) && isCalledFromSearchPage) return
                    if (isNfswTypeContent) openNsfwModal()
                }}>
                    <div className="forum_name">
                        {name}
                    </div>
                    <div className="category_name">
                        {(category_name).charAt(0) + ((category_name).slice(1).toLowerCase())}
                    </div>
                    <div className="forum_timestamp postCreatedTime">
                        {created_at ? DateConverter(created_at) : null}
                    </div>
                </div>)

        return (
            <Link className="links forum_header_left_sec text-dark" to={forum_slug} state={scrollDetails}>
                <div className="forum_header_left_sec">
                    <div className="forum_name">
                        {name}
                    </div>
                    <div className="category_name">
                        {(category_name).charAt(0) + ((category_name).slice(1).toLowerCase())}
                    </div>
                    <div className="forum_timestamp postCreatedTime">
                        {created_at ? DateConverter(created_at) : null}
                    </div>
                </div>
            </Link>
        )

    }

    return (
        <div className='forum_header'>

            {isShareBoxVisible ?
                <div className="shareKitSpace"></div> :
                null}

            {getBody()}

            {/* Works in case of seaching */}

            {isShareBoxVisible ? (
                <span type="button" className={`sharekitdots withBg sharekit`} onClick={() => toggleAcBox()}>
                    <ShareKit postData={postData} />
                </span>
            ) : null}

            {!is_only_to_show ?
                <>
                    <span className='forum_action_icon sharekitdots preventCloseAcBox' onClick={toggleAcBox}>
                        <img src={actionIcon} className="shareKitImgIcon preventCloseAcBox" />
                    </span>
                    {isActionBoxVisible
                        ?
                        // ActionBox
                        (<>
                            <div className={`shareReqCont share_req_cont_forums`}>

                                {showShareBlock ?
                                    <>
                                        <div onClick={toggleShareBox} className={`preventCloseAcBox shareReqRows user ${hideJoinDiv ? "add_padding" : ""}`} type="button">
                                            <i className="fa fa-share-alt preventCloseAcBox" aria-hidden="true"></i>
                                            <span className='preventCloseAcBox'>Share</span>
                                        </div>
                                        <div className='shareReqDivider preventCloseAcBox'></div>
                                    </>
                                    : null}

                                <>
                                    {isMyForumPage ?
                                        <>
                                            <div className="shareReqRows user" type="button" onClick={openCreateSForumModal}>
                                                <i className="fa fa-pencil" aria-hidden="true"></i>
                                                <span>
                                                    Edit
                                                </span>
                                            </div>
                                            <div className='shareReqDivider'></div>


                                            <div onClick={deleteForum} className={`shareReqRows user w-100`} type="button">
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                                <span>Delete</span>
                                            </div>
                                        </> : null}

                                    {!isMyForumPage ?
                                        <>
                                            {(!hideJoinDiv && auth() ?
                                                <>
                                                    <div className="shareReqRows user" type="button" onClick={openReqToJoinModal}>
                                                        <img src={addFriend} />
                                                        <span>Join Forum</span>
                                                    </div>
                                                    <div className='shareReqDivider'></div>
                                                </> : null)}

                                            <div onClick={openReportModal} className={`shareReqRows ${!auth() && !showShareBlock ? "pt-3" : ""} user w-100`} type="button">
                                                <img src={reportForumIcon} className="report_forum_icon" />
                                                <span>Report</span>
                                            </div>
                                        </> : null}
                                </>
                            </div>
                        </>
                        ) :
                        null
                    }
                </>
                : null

            }

        </div >
    )
}

export default ForumHeader