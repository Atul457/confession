import React, { useEffect } from 'react'

// React router imports
import { useParams } from 'react-router-dom'

// Component imports
import ForumLayoutWrapper from '../../../../components/forums/common/ForumLayoutWrapper'
import SingleForum from '../../../../components/forums/detailPage/SingleForum'
import auth from '../../../behindScenes/Auth/AuthCheck'
import ForumComments from '../../../../components/forums/detailPage/comments/ForumComments'
import SiteLoader from '../../components/SiteLoader'
import Footer from '../../common/Footer'
import SendRequestModal from '../../../../components/modals/SendJoinRequestModal'
import ReportForumModal from '../../Modals/ReportForumModal'
import ReportForumComModal from '../../Modals/ReportForumComModal'

// Helpers
import { resHandler } from '../../../../helpers/helpers'
import { fetchData } from '../../../../commonApi'
import { apiStatus } from '../../../../helpers/status'
import { getKeyProfileLoc } from '../../../../helpers/profileHelper'
import { isAllowedToComment } from '../../../../components/forums/detailPage/comments/ForumCommProvider'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc'



const ForumDetailPage = () => {

  // Hooks and vars
  const {
    forumTypes,
    forums: forumsRed,
    detailPage,
    modals,
    usersToTag
  } = useSelector(state => state.forumsReducer)
  const actionBox = forumsRed.actionBox
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
    usersToTag,
    dispatch,
    forum_index: 0,
    currForum,
    comments,
    auth: auth(),
    page,
    actionBox: actionBox ?? {},
    forumTypes,
    currForum,
    postCommentReducer
  }

  useEffect(() => {
    const clickHandler = e => {
      // if action box is visible hide it else do nothing
      let isActionIconClicked = e.target.classList
      isActionIconClicked = isActionIconClicked.contains("sharekitdots")

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
        token: getKeyProfileLoc("token", true)
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
  }, [])



  // Functions

  // Toggle action box
  const toggleForumAcboxFn = () => {
    let dataToSend = {}
    dispatch(forumHandlers.handleForums({ actionBox: dataToSend }))
  }

  if (!forumSlug)
    return (
      <ForumLayoutWrapper>
        <div className="alert alert-danger w-100" role="alert">
          Forum slug not provided.
        </div>
      </ForumLayoutWrapper>
    )

  if (forumStatus === apiStatus.LOADING)
    return (
      <ForumLayoutWrapper>
        <SiteLoader />
      </ForumLayoutWrapper>
    )

  if (forumStatus === apiStatus.REJECTED)
    return (
      <ForumLayoutWrapper>
        <div className="alert alert-danger w-100" role="alert">
          {message}
        </div>
      </ForumLayoutWrapper>
    )

  return (
    <>
      <ForumLayoutWrapper>
        <div className='w-100'>
          <SingleForum {...singleCommentProps} />
        </div>

        <div className='comments_cont'>
          <ForumComments
            isAllowedToComment={isAllToComment}
            forum_id={currForum?.forum_id ?? false} />
        </div>
      </ForumLayoutWrapper>

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

export default ForumDetailPage