import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import WithLinkComp from '../../common/components/helpers/WithLinkComp'
import { fetchData } from '../../commonApi'
import { resHandler } from '../../helpers/helpers'
import { getKeyProfileLoc } from '../../helpers/profileHelper'
import { apiStatus } from '../../helpers/status'
import nfswBanner from "../../images/nfswBanner.svg"
import { forumHandlers, mutateForumFn } from '../../redux/actions/forumsAc/forumsAc'
import { toggleNfswModal } from '../../redux/actions/modals/ModalsAc'
import { mutateSearchData, searchAcFn } from '../../redux/actions/searchAc/searchAc'
import auth from '../../user/behindScenes/Auth/AuthCheck'


const NfswAlertModal = ({ nfsw_modal, ...rest }) => {

    // Hooks and vars
    const dispatch = useDispatch()
    const forum_link = nfsw_modal?.forum_link ?? "#"
    console.log({
        nfsw_modal
    })
    const navigate = useNavigate()
    const { status } = useSelector(state => state?.modalsReducer?.nfsw_modal)
    const isLoading = status === apiStatus?.LOADING

    // Functions

    // Close modal
    const closeModal = (isCancelBtnClick = false) => {

        if (isCancelBtnClick) {
            if (rest?.isForumDetailPage) {
                dispatch(toggleNfswModal({
                    isVisible: false
                }))
                return (navigate("/forums"))
            }
            return dispatch(toggleNfswModal({
                isVisible: false
            }))
        }

        confirmNfsw()

    }

    // Confirm nsfw content
    const confirmNfsw = async () => {

        let token = getKeyProfileLoc("token", true) ?? "", data;

        dispatch(toggleNfswModal({
            isVisible: false,
            status: apiStatus.LOADING,
            message: ""
        }))

        let obj = {
            data,
            token,
            method: "get",
            url: `confirmnsw/${nfsw_modal?.forum_id}`
        }

        try {
            const res = await fetchData(obj)
            resHandler(res)

            if (rest?.isForumDetailPage) {
                dispatch(forumHandlers.handleForum({
                    mutate_data_only: true,
                    is_nsw: 0
                }))
            } else if (nfsw_modal?.is_calledfrom_searchPage) {
                // dispatch(mutateSearchData({
                //     forum_index: nfsw_modal?.forum_index,
                //     is_nsw: 0
                // }))
            } else {
                dispatch(mutateForumFn({
                    forum_index: nfsw_modal?.forum_index,
                    data_to_mutate: { is_nsw: 0 }
                }))
            }

            dispatch(toggleNfswModal({
                isVisible: false,
                status: apiStatus.FULFILLED
            }))

            if (!rest?.isForumDetailPage) navigate(forum_link, { state: { cameFromSearch: true } })

        } catch (err) {
            console.log({ err })
            dispatch(toggleNfswModal({
                status: apiStatus.REJECTED,
                message: err.message
            }))
        }
    }

    const getCloseBtn = () => {
        const closeBtnHtml = (
            <Button
                className="reqModalFootBtns"
                variant="primary"
                onClick={() => closeModal(false)}
            >
                {isLoading ? <div className="spinner-border wColor spinnerSizeFeed" role="status">
                    <span className="sr-only">Loading...</span>
                </div> : "Continue"}

            </Button>
        )

        return !auth() ? (
            <WithLinkComp link={forum_link}>{closeBtnHtml}</WithLinkComp>
        ) : closeBtnHtml
    }


    return (
        <Modal
            show={true}
            onHide={() => closeModal(true)}
            size="lg"
            className='nsfw_modal'>
            <Modal.Header>
                <h6>NSFW Forum</h6>
                <span onClick={closeModal} type="button">
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody">
                <div className="ImgCont">
                    <div className="head">
                        <img src={nfswBanner} alt="" />
                    </div>
                    <div className="body">
                        NSFW Content
                    </div>
                    <div className='desc'>
                        This Forum Contain Adult Content marked Not Safe For Work.
                        Do you Wish to Proceed?
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 reqModalFooter">
                <Button
                    className="reqModalFootBtns cancel"
                    variant="primary"
                    onClick={() => closeModal(true)}
                >
                    Cancel
                </Button>
                {getCloseBtn()}
            </Modal.Footer>
        </Modal>
    )
}

export default NfswAlertModal