import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Custom components
import ForumFooter from '../forum/ForumFooter';
import ForumHeader from '../forum/ForumHeader';
import CommentBox from './CommentBox';

// Redux
import { postComment } from '../../../redux/actions/forumsAc/forumsAc';

// Helpers
import { doCommentService, getUsersToTagService } from '../services/forumServices';


const SingleForum = props => {

    // Hooks and vars
    const {
        currForum,
        forumTypes,
        actionBox,
        dispatch,
        forum_index,
        usersToTag,
        postCommentReducer,
        comments: { count: commentsCount, page = 1 }
    } = props
    const location = useLocation()

    // cameFromSearch
    const navigate = useNavigate()
    const { isAllowedToComment = false } = currForum
    const { forum_id } = currForum,
        { data: types } = forumTypes,
        forum_type = {
            type_name: types[currForum?.type - 1]?.type_name,
            color_code: types[currForum?.type - 1]?.color_code
        },
        isPinned = false,
        showPin = false,
        isActionBoxVisible = actionBox?.forum_id === forum_id
    const forumHeaderProps = {
        category_name: currForum?.category_name,
        created_at: currForum?.created_at,
        name: currForum?.title,
        forum_id: currForum?.forum_id,
        is_requested: currForum?.is_requested,
        isReported: currForum?.isReported,
        forum_index,
        type: currForum?.type,
        dispatch,
        actionBox,
        isActionBoxVisible,
        is_for_post: false,
        is_calledfrom_detailPage: true
    }

    const forumFooterProps = {
        currForum,
        no_of_comments: currForum?.no_of_comments,
        viewcount: currForum?.viewcount ?? 0,
        forum_type,
        isPinned,
        showPin,
        forum_tags: currForum?.tags,
        forum_id: currForum?.forum_id,
        forum_index,
        dispatch
    }


    // Functions

    const doComment = commentBoxRef => {
        doCommentService({
            commentBoxRef,
            postComment,
            dispatch,
            navigate,
            forum_id,
            commentsCount,
            page,
            usedById: forum_id
        })
    }

    const getUsersToTag = async strToSearch => {
        getUsersToTagService({
            strToSearch,
            forum_id,
            dispatch
        })
    }

    const commentBoxProps = {
        commentBoxId: forum_id,
        postCommentReducer,
        usedById: forum_id,
        dispatch,
        id: forum_id,
        doComment,
        usersToTag,
        getUsersToTag: getUsersToTag?.data
    }

    return (
        <>
            <div className='w-100 mb-3'>
                <Link to={`/${location?.state?.cameFromSearch ? "search" : "forums"}`} className='backtoHome'>
                    <span className='mr-2'>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </span>
                    {location?.state?.cameFromSearch === true ? "Go back to search" : "Go back to forums"}
                </Link>
            </div>
            <div className='postCont forum_cont single_forum'>

                <ForumHeader {...forumHeaderProps} />
                <div className="postedPost">
                    <pre className="preToNormal post forum_desc">
                        {currForum?.description}
                    </pre>
                </div>
                {isAllowedToComment && <CommentBox {...commentBoxProps} />}
                <ForumFooter {...forumFooterProps} />
            </div>
        </>
    )
}

export default SingleForum