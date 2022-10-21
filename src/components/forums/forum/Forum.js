import React from 'react'

// React router imports
import { Link } from 'react-router-dom';
import { apiStatus } from '../../../helpers/status';
import { reqToJoinModalAcFn } from '../../../redux/actions/forumsAc/forumsAc';
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc';
import { forum_types, myForum, requestedStatus } from '../detailPage/comments/ForumCommProvider';

// Custom components
import ForumFooter from './ForumFooter';
import ForumHeader from './ForumHeader';


const Forum = (props) => {

    // Hooks and vars
    const {
        currForum,
        forumTypes,
        actionBox,
        dispatch,
        rememberScrollPos = false,
        isMyForumPage = false,
        forum_index
    } = props
    var scrollDetails = {
        scrollPos: rememberScrollPos ? window.scrollY : undefined,
        rememberScrollPos
    };
    const { forum_id, is_pinned } = currForum
    const { data: types } = forumTypes
    const forum_type = {
        type_name: types[currForum?.type - 1]?.type_name,
        color_code: types[currForum?.type - 1]?.color_code
    }
    const isPinned = is_pinned === 1
    const nfswContentType = 1
    const joined = currForum.is_requested === requestedStatus.approved
    const isPrivateForum = currForum?.type === forum_types.private
    const isMyForum = currForum?.isReported === myForum
    const showAlertOrNot = (currForum?.is_nsw === nfswContentType) && !(isMyForum)
    const slug = currForum?.slug
    const showPin = true
    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const forumHeaderProps = {
        category_name: currForum?.category_name,
        scrollDetails,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: currForum?.type,
        currForum,
        joined,
        isMyForum,
        showAlertOrNot,
        dispatch,
        actionBox,
        isActionBoxVisible,
        is_calledfrom_detailPage: false,
        isMyForumPage
    }

    const requested = currForum?.is_requested === requestedStatus
    const forumFooterProps = {
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        forum_type,
        isPinned,
        scrollDetails,
        showPin,
        isPrivateForum,
        is_requested: currForum?.is_requested,
        joined,
        isMyForum,
        showAlertOrNot,
        forum_tags: currForum?.tags,
        forum_id: currForum?.forum_id,
        forum_index,
        isMyForumPage,
        dispatch,
        currForum
    }
    // Functions

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
                is_calledfrom_detailPage: false,
                forum_index,
            }
        }))
    }

    const openNsfwModal = () => {
        dispatch(toggleNfswModal({ isVisible: true, forum_link: `/forums/${slug}` }))
    }

    const getBody = () => {

        if (!isMyForum) {
            if (!joined)
                return (
                    <pre className="preToNormal post forum_desc cursor_pointer" onClick={openReqToJoinModal}>
                        {currForum?.description}
                    </pre>)

            if (showAlertOrNot)
                return (
                    <pre className="preToNormal post forum_desc cursor_pointer" onClick={openNsfwModal}>
                        {currForum?.description}
                    </pre>)
        }

        return (
            <Link className="links text-dark" to={`/forums/${slug}`} state={{ scrollDetails }}>
                <pre className="preToNormal post forum_desc">
                    {currForum?.description}
                </pre>
            </Link>
        )

    }

    return (
        <div className='postCont forum_cont'>
            <ForumHeader {...forumHeaderProps} />
            <div className="postedPost">
                {getBody()}
            </div>
            <ForumFooter {...forumFooterProps} />
        </div>
    )
}

export default Forum