import React from 'react'
import { Link } from 'react-router-dom';

// Image imports
import actionIcon from '../../../../images/actionIcon.svg';

// Redux
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc';
import { useDispatch } from 'react-redux';
import { deleteForumService } from '../services/adminforumServices';

// Custom imports
import ShareKit from '../../../../user/shareKit/ShareKit';

// Helpers
import DateConverter from '../../../../helpers/DateConverter';
// import { requestedStatus } from '../detailPage/comments/ForumCommProvider';
import auth from '../../../behindScenes/Auth/AuthCheck';
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
        is_calledfrom_detailPage = false
    } = props

    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const isShareBoxVisible = shareBox?.forum_id === forum_id
    const dispatch = useDispatch()
    const postData = { is_forum: 1, forum_id, ...currForum }

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

    // Deletes the forum
    const deleteForum = () => {
        const result = window.confirm("Are you sure you want to delete this forum?")
        if (result)
            deleteForumService({
                dispatch,
                forum_id,
                forum_index
            })
    }

    const getBody = () => {

        const forum_link = is_calledfrom_detailPage ? "#" : `/admin/forums/${currForum?.slug}`
        const forum_slug = auth() ? forum_link : "/login";

        const props = {
            ...(rememberScrollPos === true && {
                onClick: () => {
                    scrollDetails.setScrollDetails({ pageName, scrollPosition: window.scrollY })
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