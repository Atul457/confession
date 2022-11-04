import React, { useEffect } from 'react'

// React router imports
import { useParams } from 'react-router-dom'

// Component imports
import SingleForumAdmin from '../../../components/forums/detailPage/SingleForumAdmin'
import auth from '../../../behindScenes/Auth/AuthCheck'
import ForumCommentsAdmin from '../../../components/forums/detailPage/comments/ForumCommentsAdmin'
import SiteLoader from '../../../../user/pageElements/components/SiteLoader'
import Footer from '../../common/Footer'
import SendRequestModal from '../../../../components/modals/SendJoinRequestModal'
import ReportForumModal from '../../../../user/pageElements/Modals/ReportForumModal'
import ReportForumComModal from '../../../../user/pageElements/Modals/ReportForumComModal'

// Helpers
import { resHandler } from '../../../../helpers/helpers'
import { fetchData } from '../../../../commonApi'
import { apiStatus } from '../../../../helpers/status'
import { isAllowedToComment } from '../../../../components/forums/detailPage/comments/ForumCommProvider'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc'
import ForumLayoutWrapperAdmin from '../../../components/forums/common/ForumLayoutWrapperAdmin'


const ForumDetailPageAdmin = () => {

  // Hooks and vars
  const { modalsReducer: { nfsw_modal }, forumsReducer } = useSelector(state => state)
  const {
    forumTypes,
    forums: forumsRed,
    detailPage,
    modals,
    usersToTag
  } = forumsReducer
  const actionBox = forumsRed.actionBox
  const shareBox = forumsRed.shareBox
  const { requestToJoinModal, reportForumModal, reportForumCommentModal } = modals
  const forumSlug = useParams()?.slug ?? false
  const dispatch = useDispatch()
  const { handleForum } = forumHandlers
  const {
    status: forumStatus,
    data: currForum,
    postComment: postCommentReducer,
    message,
    comments,
    page
  } = detailPage
  const isAllToComment = isAllowedToComment(currForum)
  const singleCommentProps = {
    nfsw_modal,
    usersToTag,
    dispatch,
    forum_index: 0,
    currForum,
    isAllowedToComment: isAllowedToComment(currForum),
    comments,
    auth: auth(),
    shareBox: shareBox ?? {},
    page,
    actionBox: actionBox ?? {},
    forumTypes,
    postCommentReducer
  }

  useEffect(() => {
    const clickHandler = e => {
      // if action box is visible hide it else do nothing
      let isActionIconClicked = e.target.classList
      isActionIconClicked = isActionIconClicked.contains("preventCloseAcBox")

      if (!isActionIconClicked && ("forum_id" in actionBox || "forum_index" in actionBox))
        toggleForumAcboxFn()
    }
    document.addEventListener("click", clickHandler)
    return () => {
      document.removeEventListener("click", clickHandler)
    }
  }, [actionBox])


  useEffect(() => {
    // Get Forum
    const getForum = async () => {
      let obj = {
        token: "",
        method: "get",
        url: `getforum/${forumSlug}`,
        token: ""
      }
      try {
        let res = await fetchData(obj)
        res = resHandler(res)
        let forum = res?.forum ?? {}
        forum = { ...forum, isAllowedToComment: isAllowedToComment(forum) }
        dispatch(handleForum({ data: forum ?? {}, status: apiStatus.FULFILLED }))
      } catch (error) {
        dispatch(handleForum({ status: apiStatus.REJECTED, message: error?.message }))
      }
    }
    if (forumSlug) getForum()
  }, [forumSlug])



  // Functions

  // Toggle action box
  const toggleForumAcboxFn = () => {
    let dataToSend = {}
    dispatch(forumHandlers.handleForums({ actionBox: dataToSend }))
  }

  if (!forumSlug)
    return (
      <ForumLayoutWrapperAdmin>
        <div className="alert alert-danger w-100" role="alert">
          Forum slug not provided.
        </div>
      </ForumLayoutWrapperAdmin>
    )

  if (forumStatus === apiStatus.LOADING)
    return (
      <ForumLayoutWrapperAdmin>
        <SiteLoader />
      </ForumLayoutWrapperAdmin>
    )

  if (forumStatus === apiStatus.REJECTED)
    return (
      <ForumLayoutWrapperAdmin>
        <div className="alert alert-danger w-100" role="alert">
          {message}
        </div>
      </ForumLayoutWrapperAdmin>
    )

  return (
    <>
      <ForumLayoutWrapperAdmin>
        <div className='w-100'>
          <SingleForumAdmin {...singleCommentProps} />
        </div>

        <div className='comments_cont'>
          <ForumCommentsAdmin
            usersToTag={usersToTag}
            isAllowedToComment={isAllToComment}
            forum_id={currForum?.forum_id ?? false} />
        </div>
      </ForumLayoutWrapperAdmin>

      {/* Modals */}

      {/* Send join request modal */}
      {requestToJoinModal.visible && <SendRequestModal />}

      {/* Report forum modal */}
      {reportForumModal.visible && <ReportForumModal />}

      {/* Report comment modal */}
      {reportForumCommentModal.visible && <ReportForumComModal />}

      <Footer />
    </>
  )
}

export default ForumDetailPageAdmin