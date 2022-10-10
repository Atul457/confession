import React from 'react'

// Helpers
import DateConverter from '../../../helpers/DateConverter'

// Image imports
import actionIcon from '../../../images/actionIcon.svg';
import addFriend from '../../../images/addFriend.svg';
import reportForumIcon from "../../../images/reportForumIcon.svg";
import cancelFriend from "../../../images/cancelFriendPop.svg";

// Redux
import { forumHandlers, reportForumAcFn, reqToJoinModalAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { useDispatch } from 'react-redux';

import { forum_types, reportedFormStatus, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import { apiStatus } from '../../../helpers/status';

const ForumHeader = props => {

    // Hooks and vars
    const {
        name,
        category_name,
        created_at,
        forum_index,
        actionBox,
        forum_id,
        type,
        is_requested,
        is_calledfrom_detailPage = false,
        isReported,
        is_for_post = true
    } = props
    const sharekit = false
    const deletable = false
    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const dispatch = useDispatch()
    const hideJoinDiv = type === forum_types.closed || type === forum_types.public || is_requested === requestedStatus.approved
    const requested = is_requested === requestedStatus.is_requested


    // Functions

    const toggleForumAcboxFn = () => {
        let dataToSend = isActionBoxVisible ? {} : { forum_id, forum_index }
        dispatch(forumHandlers.handleForums({ actionBox: dataToSend }))
    }

    // Toggle action box
    const toggleAcBox = () => {
        toggleForumAcboxFn()
    }

    // Opens req to join modal
    const openReqToJoinModal = () => {
        dispatch(reqToJoinModalAcFn({
            visible: true,
            status: apiStatus.IDLE,
            message: "",
            data: {
                forum_id,
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


    return (
        <div className='forum_header'>
            <span
                type="button"
                onClick={toggleAcBox}
                className={`sharekitdots withBg ${sharekit === false ? "justify-content-end" : ""} ${!deletable ? "resetRight" : ""}`}>

            </span>


            <div className="forum_header_left_sec">
                <div className="forum_name">
                    {name}
                </div>
                <div className="category_name">
                    {category_name}
                </div>
                <div className="forum_timestamp postCreatedTime">
                    {created_at ? DateConverter(created_at) : null}
                </div>
            </div>

            <span
                className='forum_action_icon'
            >
                <img src={actionIcon} className="shareKitImgIcon" />
                {isActionBoxVisible
                    ?
                    // ActionBox
                    (<div className={`shareReqCont share_req_cont_forums`} onClick={toggleForumAcboxFn}>
                        {!hideJoinDiv &&
                            <>
                                <div className="shareReqRows user" type="button" onClick={openReqToJoinModal}>
                                    <img src={requested ? cancelFriend : addFriend} />
                                    <span>
                                        {requested ? "Cancel request" : "Request to Join"}
                                    </span>
                                </div>
                                <div className='shareReqDivider'></div>
                            </>
                        }

                        <div onClick={openReportModal} className={`shareReqRows user w-100 ${hideJoinDiv ? "add_padding" : ""}`} type="button">
                            <img src={reportForumIcon} className="report_forum_icon" />
                            <span>Report</span>
                        </div>
                    </div>)
                    // ActionBox
                    :
                    null}
            </span>

        </div>
    )
}

export default ForumHeader