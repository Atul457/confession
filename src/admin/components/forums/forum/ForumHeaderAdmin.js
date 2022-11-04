import React from 'react'
import { Link } from 'react-router-dom';

// Helpers
import DateConverter from '../../../../helpers/DateConverter';

// Image imports
import actionIcon from '../../../../images/actionIcon.svg';

// Redux
import { createForumModalFnAc, deleteForumAcFn, forumHandlers, reportForumAcFn, reqToJoinModalAcFn } from '../../../../redux/actions/forumsAc/forumsAc';
import { useDispatch } from 'react-redux';
import { toggleNfswModal } from '../../../../redux/actions/modals/ModalsAc';

import { forum_types, reportedFormStatus, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import { apiStatus } from '../../../../helpers/status';
import auth from '../../../behindScenes/Auth/AuthCheck';
import ShareKit from '../../../../user/shareKit/ShareKit';
import { scrollDetails } from '../../../../helpers/helpers';

const ForumHeaderAdmin = props => {

    // Hooks and vars
    const {
        name,
        category_name,
        is_only_to_show = false,
        created_at,
        currForum,
        pageName = "",
        rememberScrollPos,
        // isMyForumPage,
        shareBox,
        // isMyForum = false,
        forum_index,
        actionBox,
        forum_id,
        type,
        is_requested,
        is_calledfrom_detailPage = false,
        // isReported,
        // is_for_post = true,
    } = props

    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const isShareBoxVisible = shareBox?.forum_id === forum_id
    const dispatch = useDispatch()
    // const hideJoinDiv = true
    // const requested = is_requested === requestedStatus.is_requested
    const joined = currForum?.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const postData = { is_forum: 1, forum_id, ...currForum }
    // const showShareBlock = type !== forum_types.closed && (isPrivateForum ? joined : true)

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

    const deleteForum = () => {
        dispatch(deleteForumAcFn({
            visible: true,
            data: {
                forum_id,
                forum_index
            }
        }))
    }

    // const openCreateSForumModal = () => {
    //     dispatch(createForumModalFnAc({
    //         visible: true,
    //         forum_details: currForum,
    //         isBeingEdited: true
    //     }))
    // }

    const getBody = () => {

        const forum_link = is_calledfrom_detailPage ? "#" : `/admin/forums/${currForum?.slug}`
        const forum_slug = auth() ? forum_link : "/login";

        const props = {
            ...(rememberScrollPos === true && {
                onClick: () => {
                    scrollDetails.setScrollDetails({ pageName, scrollPosition: window.scrollY })
                    console.log({ pageName, scrollPosition: window.scrollY })
                }
            })
        }

        return (
            <Link
                className="links forum_header_left_sec text-dark"
                to={forum_slug}
                {...props}>
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
            </Link>)

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
                        (<>
                            <div className={`shareReqCont share_req_cont_forums`}>
                                <div onClick={toggleShareBox} className={`preventCloseAcBox shareReqRows user ${is_calledfrom_detailPage ? "add_padding" : ""}`} type="button">
                                    <i className="fa fa-share-alt preventCloseAcBox" aria-hidden="true"></i>
                                    <span className='preventCloseAcBox'>Share</span>
                                </div>
                                {!is_calledfrom_detailPage ?
                                    <>
                                        <div className='shareReqDivider preventCloseAcBox'></div>
                                        <div onClick={deleteForum} className={`shareReqRows user w-100`} type="button">
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                            <span>Delete</span>
                                        </div>
                                    </>
                                    : null}
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

export default ForumHeaderAdmin