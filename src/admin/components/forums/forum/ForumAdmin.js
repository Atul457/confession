import React from 'react'

// React router imports
import { Link } from 'react-router-dom';

// Custom components
import ForumFooter from './ForumFooterAdmin';
import ForumHeader from './ForumHeaderAdmin';

// Helpers
import { forum_types, myForum, requestedStatus } from '../detailPage/comments/ForumCommProvider';
import auth from '../../../behindScenes/Auth/AuthCheck';
import { scrollDetails } from '../../../../helpers/helpers';


const ForumAdmin = (props) => {

    // Hooks and vars
    const {
        currForum,
        forumTypes,
        shareBox,
        actionBox,
        dispatch,
        pageName = "",
        rememberScrollPos = false,
        isMyForumPage = false,
        forum_index
    } = props
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
        rememberScrollPos,
        pageName,
        category_name: currForum?.category_name,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        shareBox,
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

    const forumFooterProps = {
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        rememberScrollPos,
        pageName,
        forum_type,
        isPinned,
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

    const getBody = () => {

        const forum_slug = auth() ? `/admin/forums/${slug}` : "/login"
        const props = {
            ...(rememberScrollPos === true && {
                onClick: () => {
                    scrollDetails.setScrollDetails({ pageName, scrollPosition: window.scrollY })
                }
            })
        }

        return (
            <Link
                {...props}
                className="links text-dark"
                to={forum_slug}>
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

export default ForumAdmin