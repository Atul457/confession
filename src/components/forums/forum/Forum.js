import React from 'react'

// React router imports
import { Link } from 'react-router-dom';
import { toggleNfswModal } from '../../../redux/actions/modals/ModalsAc';
import { myForum } from '../detailPage/comments/ForumCommProvider';

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
    const showAlertOrNot = (currForum?.is_nsw === nfswContentType) && !(currForum?.isReported === myForum)
    const slug = currForum?.slug
    const showPin = true
    const isActionBoxVisible = actionBox?.forum_id === forum_id
    const forumHeaderProps = {
        category_name: currForum?.category_name,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: currForum?.type,
        currForum,
        dispatch,
        actionBox,
        isActionBoxVisible,
        is_calledfrom_detailPage: false,
        isMyForumPage
    }

    const forumFooterProps = {
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        forum_type,
        isPinned,
        showPin,
        forum_tags: currForum?.tags,
        forum_id: currForum?.forum_id,
        forum_index,
        isMyForumPage,
        dispatch,
        currForum
    }


    // Functions

    const openNsfwModal = () => {
        dispatch(toggleNfswModal({ isVisible: true, forum_link: `/forums/${slug}` }))
    }

    return (
        <div className='postCont forum_cont'>
            <ForumHeader {...forumHeaderProps} />
            <div className="postedPost">
                {showAlertOrNot ?
                    <pre className="preToNormal post forum_desc cursor_pointer" onClick={openNsfwModal}>
                        {currForum?.description}
                    </pre> :
                    <Link className="links text-dark" to={`/forums/${slug}`}>
                        <pre className="preToNormal post forum_desc">
                            {currForum?.description}
                        </pre>
                    </Link>}
            </div>
            <ForumFooter {...forumFooterProps} />
        </div>
    )
}

export default Forum