import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Custom components
import ForumFooterAdmin from '../forum/ForumFooterAdmin';
import ForumHeaderAdmin from '../forum/ForumHeaderAdmin';

// Redux
import { forumHandlers, postComment, usersToTagAcFn } from '../../../../redux/actions/forumsAc/forumsAc';

// Helpers
import { doCommentService, getUsersToTagService } from '../services/adminforumServices';
import { apiStatus } from '../../../../helpers/status';

const SingleForumAdmin = props => {

    // Hooks and vars
    const {
        currForum,
        forumTypes,
        actionBox,
        shareBox,
        dispatch,
        forum_index,
        usersToTag,
        postCommentReducer,
        comments: { count: commentsCount, page = 1 }
    } = props

    // cameFromSearch
    const navigate = useNavigate()

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
        currForum,
        actionBox,
        shareBox,
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

    // Do comment Function
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

    // Fetches users to tag
    const getUsersToTag = async string => {
        let strToSearch = null;
        const regex = /(^@|(\s@))((\w+)?)$/;
        var result = regex.exec(string);

        if (result) strToSearch = result[0]?.trim().replace("@", "");
        else strToSearch = null;

        if (strToSearch || strToSearch === "") {
            getUsersToTagService({
                strToSearch: strToSearch,
                forum_id,
                dispatch,
                isCalledByParent: true
            })
        } else if (usersToTag?.data?.length) {
            dispatch(usersToTagAcFn({
                data: [],
                status: apiStatus.IDLE,
                toSearch: ""
            }))
        }
    }

    // const commentBoxProps = {
    //     isCalledByParent: true,
    //     postCommentReducer,
    //     usedById: forum_id,
    //     dispatch,
    //     id: forum_id,
    //     doComment,
    //     usersToTag,
    //     toSearch: usersToTag?.strToSearch ?? "",
    //     getUsersToTag
    // }

    // const resetTagList = () => {
    //     dispatch(usersToTagAcFn({
    //         data: [],
    //         status: apiStatus.IDLE,
    //         toSearch: ""
    //     }))
    //     dispatch(forumHandlers.handleForums({ shareBox: {}, actionBox: {} }))
    // }

    return (
        <>
            <div className='w-100 mb-3'>
                <Link
                    to="/admin/forums"
                    className='backtoHome'>
                    <span className='mr-2'>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </span>
                    Go back to forums
                </Link>
            </div>
            <div className='postCont forum_cont single_forum'>

                <ForumHeaderAdmin {...forumHeaderProps} />
                <div className="postedPost">
                    <pre className="preToNormal post forum_desc">
                        {currForum?.description}
                    </pre>
                </div>
                {/* {isAllowedToComment && <CommentBox {...commentBoxProps} />} */}
                <ForumFooterAdmin {...forumFooterProps} />
            </div>
        </>
    )
}

export default SingleForumAdmin