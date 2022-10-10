import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../../commonApi'
import { resHandler } from '../../helpers/helpers'
import { apiStatus } from '../../helpers/status'
import requestModalImg from "../../images/requestModalImg.png"
import { forumHandlers, mutateForumFn, reqToJoinModalAcFn } from '../../redux/actions/forumsAc/forumsAc'
import { requestedStatus } from '../forums/detailPage/comments/ForumCommProvider'
import { ShowResComponent } from '../HelperComponents'
import { getKeyProfileLoc } from "../../helpers/profileHelper"


const SendRequestModal = () => {

  const { modals, detailPage } = useSelector(state => state.forumsReducer)
  const { handleForum } = forumHandlers
  const detailPageData = detailPage.data
  const { requestToJoinModal } = modals
  const isError = requestToJoinModal.status === apiStatus.REJECTED
  const message = requestToJoinModal?.message
  const { requested, forum_index, is_calledfrom_detailPage = false } = requestToJoinModal.data
  const isLoading = requestToJoinModal.status === apiStatus.LOADING
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(reqToJoinModalAcFn({
      visible: false,
      status: apiStatus.IDLE,
      data: {
        message: "",
        requested: false,
      }
    }))
  }


  const sendRequest = () => {

    // is_calledfrom_detailPage : the modal is opened using a forum
    // !is_calledfrom_detailPage : the modal is opened using detail page

    if (is_calledfrom_detailPage) dispatch(handleForum({
      data: { ...detailPageData, is_requested: requestedStatus.is_not_requested }
    }))
    else dispatch(mutateForumFn({
      forum_index,
      data_to_mutate: { is_requested: requestedStatus.is_not_requested }
    }))
    closeModal()
  }

  const cancelRequest = () => {

    // is_calledfrom_detailPage : the modal is opened using a forum
    // !is_calledfrom_detailPage : the modal is opened using detail page

    if (is_calledfrom_detailPage) dispatch(handleForum({
      data: { ...detailPageData, is_requested: requestedStatus.is_requested }
    }))
    else dispatch(mutateForumFn({
      forum_index,
      data_to_mutate: { is_requested: requestedStatus.is_requested }
    }))

    closeModal()
  }

  const sendJoinRequest = async (is_cancelled = 0) => {

    let token = getKeyProfileLoc("token", true) ?? "";

    let data = {
      is_cancelled: is_cancelled,
    }

    dispatch(reqToJoinModalAcFn({
      status: apiStatus.LOADING
    }))

    let obj = {
      data,
      token,
      method: "post",
      url: `sendforumrequest/${requestToJoinModal?.data?.forum_id}`
    }

    try {
      const res = await fetchData(obj)
      resHandler(res)
      if (is_cancelled === 0) {
        // dispatch(reqToJoinModalAcFn({
        //   data: {
        //     requested: true,
        //   },
        //   status: apiStatus.FULFILLED
        // }))
        cancelRequest()
      }
      else {
        // dispatch(reqToJoinModalAcFn({
        //   data: {
        //     requested: false,
        //     message: ""
        //   },
        //   status: apiStatus.FULFILLED
        // }));
        sendRequest()
      }
    } catch (err) {
      dispatch(reqToJoinModalAcFn({
        status: apiStatus.REJECTED,
        message: err.message
      }))
    }
  }



  return (
    <>
      <Modal
        show={requestToJoinModal.visible}
        onHide={closeModal}
        size="md"
        className='send_joinreq_modal'>
        <Modal.Header>
          <h6>Send a Join Request</h6>
          <span onClick={closeModal} type="button">
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </Modal.Header>
        <Modal.Body className="privacyBody friendReqModalBody">
          <div className="reqModalImgCont">
            <div className="head">
              <img src={requestModalImg} alt="" />
            </div>
            <div className="body">
              {!requested ?
                "Are you sure you want to send join request to this forum?"
                :
                "Are you sure you want to cancel the join request sent, to this forum?"
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-0 reqModalFooter">
          <ShowResComponent isError={isError} message={message} classList="w-100 text-center pb-2" />
          <Button
            className="reqModalFootBtns cancel"
            variant="primary"
            onClick={closeModal}
          >
            No
          </Button>
          {requested ?
            <Button
              className="reqModalFootBtns"
              variant="primary"
              onClick={() => sendJoinRequest(1)}
            >
              {isLoading ?
                <div className="spinner-border wColor spinnerSizeFeed" role="status">
                  <span className="sr-only">Loading...</span>
                </div> :
                "Yes"}
            </Button>
            :
            <Button
              className="reqModalFootBtns"
              variant="primary"
              onClick={() => sendJoinRequest()}
            >
              {isLoading ?
                <div className="spinner-border wColor spinnerSizeFeed" role="status">
                  <span className="sr-only">Loading...</span>
                </div> :
                "Send"}
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SendRequestModal