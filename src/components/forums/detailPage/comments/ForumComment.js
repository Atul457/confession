import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Helpers
import DateConverter from '../../../../helpers/DateConverter'

// Image imports
import userIcon from "../../../../images/userAcc.svg"
import editCommentIcon from "../../../../images/editCommentIcon.svg"
import commentReplyIcon from "../../../../images/creplyIcon.svg"
import upvoted from '../../../../images/upvoted.svg';
import upvote from '../../../../images/upvote.svg';

// Component imports
import ForumSubComments from './ForumSubComments'

// HelperComp function
import { getKeyProfileLoc } from '../../../../helpers/profileHelper'
import { fetchData } from '../../../../commonApi'
import { apiStatus } from '../../../../helpers/status'
import { deleteForumCommService, doCommentService, likeDislikeService } from '../../services/forumServices'
import CommentBox from '../CommentBox'
import { reportedFormStatus } from './ForumCommProvider'

// Redux
import { deleteForumCommSubcomAcFn, forumHandlers, postComment, reportForumCommAcFn } from '../../../../redux/actions/forumsAc/forumsAc'


const ForumComment = (props) => {

  // Hooks and vars
  const {
    comment: currComment,
    auth,
    loggedInUserId,
    postComment: postCommentReducer,
    dispatch,
    navigate,
    commentsCount,
    page,
    isAllowedToComment,
    forum_id,
    commentBox: { commentId: activeComBoxId },
    updateBox: { commentId: activeUpdateComBoxId },
    updateBox,
    commentBox
  } = props
  let {
    comment_by,
    created_at,
    countChild,
    profile_image = "",
    commentIndex = undefined,
    user_id = false,
    comment_id: commentId,
    isReported,
    is_liked = 0
  } = currComment
  const rootDetails = {
    commentId,
    commentIndex
  }
  const subComments = currComment?.subComments

  const { handleCommentAcFn, handleCommentsAcFn } = forumHandlers,
    isCommentBoxVisible = auth() && activeComBoxId === commentId,
    isUpdateComBoxVisible = auth() && activeUpdateComBoxId === commentId,
    isMyComment = loggedInUserId === user_id

  const doCommentVars = {
    navigate,
    parent_root_info: {
      parent_id: commentId,
      root_id: commentId
    },
    forum_id,
    commentsCount,
    page,
    postCommentReducer
  }

  // Expands the comment if collapsed
  useEffect(() => {
    if (subComments?.isBeingExpanded === true) fetchSubComs({})
  }, [subComments?.isBeingExpanded])

  useEffect(() => {
    const { present, show } = subComments
    if (present === true && show === true) fetchSubComs({ fetchOnLoad: true })
  }, [])


  // Functions

  // Toggles reply btn and comment/edit comment field
  const toggleReplyBtn = () => {
    dispatch(handleCommentsAcFn({
      commentBox: {
        ...(!isCommentBoxVisible && { commentId })
      }
    }))
  }

  // Fetch subcomments on the comment
  async function fetchSubComs({ page = 1, append = false, fetchOnLoad = false }) {

    let token = getKeyProfileLoc("token", true) ?? "",
      data = {},
      obj = {}

    data = {
      forum_id,
      page,
      "root_id": commentId,
    }

    obj = {
      data: data,
      token: token,
      method: "post",
      url: "getforumcomments"
    }

    try {
      const res = await fetchData(obj)
      if (res.data.status === true) {
        return dispatch(handleCommentAcFn({
          subComments: {
            ...subComments,
            ...(fetchOnLoad && { isShown: true }),
            loading: apiStatus.FULFILLED,
            data: res.data.body.comments,
          },
          commentIndex
        }))
      } else {
        dispatch(handleCommentAcFn({
          subComments: {
            ...subComments,
            ...(fetchOnLoad && { isShown: false }),
            loading: apiStatus.REJECTED,
          },
          commentIndex
        }))
      }
    } catch (err) {
      dispatch(handleCommentAcFn({
        subComments: {
          ...subComments,
          loading: apiStatus.REJECTED,
          message: err.message ?? "something went wrong_"
        },
        commentIndex
      }))
    }
  }

  // Opens report forum comment modal
  const openReportCommentModal = () => {
    dispatch(reportForumCommAcFn({
      visible: true,
      status: apiStatus.IDLE,
      message: "",
      data: {
        forum_id,
        is_for_subcomment: false,
        comment_index: commentIndex,
        comment_id: commentId,
        isReported: isReported === reportedFormStatus.reported
      }
    }))
  }

  const doComment = (commentBoxRef, updateComment = false) => {
    doCommentService({
      commentBoxRef,
      postComment,
      ...(updateComment === true && {
        updateComment,
        commentId
      }),
      dispatch,
      navigate,
      forum_id,
      isSubComment: updateComment ? false : true,
      usedById: commentId,
      parent_root_info: {
        parent_id: commentId,
        root_id: commentId,
        parentIndex: commentIndex
      },
      commentsCount,
      page
    })
  }

  const upvoteOrDownvote = async (isLiked) => {
    likeDislikeService({
      isLiked,
      like: currComment?.like,
      dispatch,
      forum_id,
      is_for_sub_comment: false,
      commentIndex,
      commentId
    })
  }

  // Open update comment box
  const openUpdateComBox = () => {
    dispatch(handleCommentsAcFn({
      updateBox: {
        ...(!isUpdateComBoxVisible && { commentId })
      }
    }))
  }

  // DELETES THE COMMENT  
  const deleteCommentFunc = async () => {
    // console.log({ subComments: subComments.data ?? [], length: subComments?.data?.length ?? 0 })
    // console.log({
    //   postComment,
    //   dispatch,
    //   forum_id,
    //   isSubComment: false,
    //   usedById: commentId,
    //   commentsCount: subComments?.data?.length ?? 0
    // })
    deleteForumCommService({
      postComment,
      dispatch,
      forum_id,
      isSubComment: false,
      usedById: commentId,
      commentIndex,
      commentsCount: subComments?.data?.length ?? 0
    })
    // dispatch(deleteForumCommSubcomAcFn({ commentIndex }))
    // deleteForumCommSubcomAcFn

    // let confessionId = props.postId;
    // let commentId = props.commentId;

    // let obj = {
    //   data: {},
    //   token: getKeyProfileLoc("token", true) ?? "",
    //   method: "get",
    //   url: `deletecomment/${confessionId}/${commentId}`,
    // }

    // try {
    //   const res = await fetchData(obj)
    //   if (res.data.status === true) {
    //     let delCommentCount = 1;
    //     // DECRESES WITH THE COUNT OF ITS CHILD AND 1, WHICH IS IT ITSELF
    //     if (props.countChild > 0)
    //       delCommentCount = props.countChild + 1;
    //     props.updateComments(commentId, delCommentCount);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  profile_image = profile_image === "" ? userIcon : profile_image

  if (subComments?.status === apiStatus.LOADING)
    return (
      <div className="w-100 text-center">
        <div className="spinner-border pColor d-inline-block mx-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )

  if (subComments?.status === apiStatus.REJECTED)
    return <div className="alert alert-danger" role="alert">
      {subComments?.message}
    </div>


  return (
    <>
      <div className='postCont forum_comment'>


        {/* Edit/Delete comment */}
        {(auth && currComment?.is_editable === 1) ?
          <div className='edit_delete_com_forum'>
            <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
            {!isUpdateComBoxVisible ? <img src={editCommentIcon} className='editCommentIcon' onClick={openUpdateComBox} /> : null}
          </div>
          : null}
        {/* Edit/Delete comment */}

        {/* Report comment */}
        {(auth && isReported !== 2) ? <span className="reportPost" onClick={openReportCommentModal}>
          <i className="fa fa-exclamation-circle reportComIcon" aria-hidden="true"></i>
        </span> : null}
        {/* } */}
        {/* Report comment */}

        <div className="postContHeader commentsContHeader">
          <span className="commentsGotProfileImg">
            <img src={profile_image} alt="user_profile_image" />
          </span>

          {user_id !== false ?
            <Link className={`forum_com_p_link`}
              to={(auth ? (isMyComment ? `/profile` : `/userProfile/${user_id}`) : `/userProfile/${user_id}`)}>
              <span className="userName">
                {comment_by}
              </span>
            </Link>
            :
            (<span className="userName">
              {comment_by}
            </span>)
          }

          <span className="postCreatedTime">
            {created_at ? DateConverter(created_at) : null}
          </span>
        </div>

        <div className="postBody">
          <div className="postedPost mb-0">
            <pre className="preToNormal">
              {currComment?.comment}
            </pre>

            {/* Update box */}
            {isUpdateComBoxVisible ? <CommentBox
              usedById={commentId}
              usersToTag={[]}
              isForUpdateCom={true}
              postCommentReducer={postCommentReducer}
              doComment={doComment} /> : null}
            {/* Update box */}

            {isAllowedToComment &&
              <div className="replyCont">
                <span className="reply_btn">
                  <div onClick={toggleReplyBtn}>
                    <img src={commentReplyIcon} alt="" className='replyIcon' />
                    <span className='pl-2'>Reply</span>
                  </div>


                  {/* like dislike */}
                  {
                    <div className='iconsMainCont'>
                      <div className={`upvote_downvote_icons_cont buttonType`}>
                        {is_liked === 1 ?
                          <img src={upvoted} alt="" onClick={() => upvoteOrDownvote(false)} /> :
                          <img src={upvote} alt="" onClick={() => upvoteOrDownvote(true)} />}
                        <span className='count'>{currComment?.like}</span>
                      </div>
                    </div>
                  }
                  {/* like dislike */}

                </span>

                {/* Comment box */}
                {isCommentBoxVisible ?
                  <>
                    <CommentBox
                      usersToTag={[]}
                      usedById={commentId}
                      postCommentReducer={postCommentReducer}
                      doComment={doComment}
                    />
                  </> :
                  null}
                {/* Comment box */}

              </div>}
          </div>
        </div>
      </div >

      <ForumSubComments
        isAllowedToComment={isAllowedToComment}
        commentIndex={commentIndex}
        forum_id={forum_id}
        updateBox={updateBox}
        doCommentVars={doCommentVars}
        commentBox={commentBox}
        subComments={subComments}
        rootDetails={rootDetails}
        loggedInUserId={loggedInUserId}
        dispatch={dispatch}
        countChild={countChild}
        parent_created_at={created_at}
      />
    </>
  )
}

export default ForumComment