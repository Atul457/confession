import React, { useEffect, useState } from 'react'

// Custom components
import Forum from '../forum/Forum'
import SendRequestModal from '../../modals/SendJoinRequestModal'
import ReportForumModal from '../../../user/pageElements/Modals/ReportForumModal'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../redux/actions/forumsAc/forumsAc'
import { apiStatus } from '../../../helpers/status'

// helpers
import { fetchData } from '../../../commonApi'
import { resHandler } from '../../../helpers/helpers'
import { getKeyProfileLoc } from '../../../helpers/profileHelper'
import CreateFormModal from '../../modals/CreateFormModal'
import DeleteForumModal from '../../modals/DeleteForumModal'


const MyForums = () => {

  // Hooks and vars
  const {
    forums: forumsRed,
    forumTypes,
    modals
  } = useSelector(state => state.forumsReducer)
  const { requestToJoinModal, reportForumModal, createForumModal, deleteForumModal } = modals
  const dispatch = useDispatch()
  const { handleForums } = forumHandlers
  const { data: forums, status: forumsStatus } = forumsRed

  // Gets the data from the api and dispatchs it
  useEffect(() => {
    getForums(true)
  }, [])


  // Functions

  // Get Forums
  const getForums = async (append = false) => {
    let obj = {
      token: getKeyProfileLoc("token", true) ?? "",
      method: "get",
      url: `getmyforums/1`
    }
    try {
      let res = await fetchData(obj)
      res = resHandler(res)
      dispatch(handleForums({ data: res?.forums ?? [], status: apiStatus.FULFILLED }))
    } catch (error) {
      console.log(error)
    }

    if (0) console.log(append)
  }

  // Render forums
  const renderForums = forumsArr => {
    if (forumsArr && forumsArr.length) return (
      forums.map((currForum, cfIndex) => {
        return <Forum
          isMyForumPage={true}
          dispatch={dispatch}
          forum_index={cfIndex}
          key={`forumNo${cfIndex}`}
          actionBox={forumsRed.actionBox ?? {}}
          forumTypes={forumTypes}
          currForum={currForum} />
      })
    )

    return (
      <h5 className='endListMessage noConfessions'>No forums found</h5>
    )
  }

  if (forumsStatus === apiStatus.LOADING)
    return (
      <div className="w-100 text-center">
        <div className="spinner-border pColor d-inline-block mx-auto" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )

  return (
    <div>
      {renderForums(forums)}

      {/* Modals */}

      {/* Send join request modal */}
      {requestToJoinModal.visible && <SendRequestModal />}

      {/* Report forum modal */}
      {reportForumModal.visible && <ReportForumModal />}

      {/* Create forum modal */}
      {createForumModal.visible && <CreateFormModal />}

      {/* Create forum modal */}
      {deleteForumModal.visible && <DeleteForumModal
        deleteForumModal={deleteForumModal}
        setDeleteForumModal={() => { }}
      />}

    </div>
  )
}

export default MyForums