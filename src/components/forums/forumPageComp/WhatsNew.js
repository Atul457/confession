import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

// Custom components
import Forum from '../forum/Forum'
import SendRequestModal from '../../modals/SendJoinRequestModal'
import ReportForumModal from '../../../user/pageElements/Modals/ReportForumModal'
import NfswAlertModal from '../../modals/NfswAlertModal'
import AdMob from '../../../user/pageElements/components/AdMob'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { forumHandlers } from '../../../redux/actions/forumsAc/forumsAc'
import { apiStatus } from '../../../helpers/status'

// helpers
import { fetchData } from '../../../commonApi'
import { resHandler, scrollToTop } from '../../../helpers/helpers'
import { getKeyProfileLoc } from '../../../helpers/profileHelper'
import RightSideAdComp from '../../sidebarAds/RightSideAdComp'


const WhatsNew = ({ slotsDetails }) => {

    // Hooks and vars
    const {
        forums: forumsRed,
        categories,
        forumTypes,
        modals
    } = useSelector(state => state.forumsReducer)
    // const { adSlots, setAdSlots } = slotsDetails;
    const { modalsReducer: { nfsw_modal } } = useSelector(state => state)
    const { requestToJoinModal, reportForumModal } = modals
    const dispatch = useDispatch()
    const { activeCategory } = categories
    const { handleForums } = forumHandlers
    const { data: forums, status: forumsStatus, page, count = 0 } = forumsRed
    const afterHowManyShowAdd = 7;    //AFTER THIS MUCH SHOW ADDS


    // Gets the data from the api and dispatchs it
    useEffect(() => {
        getForums(1, false)
    }, [activeCategory])

    useEffect(() => {
        scrollToTop()
    }, [])

    // Functions

    // Get Forums
    const getForums = async (page = 1, append = false) => {
        let acCategory = activeCategory ? `${activeCategory}` : 'all'
        let obj = {
            token: getKeyProfileLoc("token", true) ?? "",
            method: "get",
            url: `getforums/${acCategory}/${page}`
        }
        try {
            let res = await fetchData(obj)
            res = resHandler(res)
            const forums_from_api = res?.forums ?? []
            dispatch(handleForums({ data: append ? [...forums, ...forums_from_api] : forums_from_api, status: apiStatus.FULFILLED, count: res?.count }))
        } catch (error) {
            console.log(error)
        }

        if (0) console.log(append)
    }

    // Render forums
    const renderForums = forumsArr => {
        if (forumsArr && forumsArr.length) return (
            forums.map((currForum, cfIndex) => {
                return (<div key={`forumNo${cfIndex}`}>
                    <Forum
                        dispatch={dispatch}
                        forum_index={cfIndex}
                        actionBox={forumsRed.actionBox ?? {}}
                        forumTypes={forumTypes}
                        currForum={currForum} />

                    {/* {
                        ((cfIndex + 1) % afterHowManyShowAdd === 0) &&
                        <div className="mb-4">
                            <AdMob mainContId={`adIndexx${cfIndex}`} setAddSlots={setAdSlots} slots={adSlots} />
                        </div>
                    } */}
                </div>)
            })
        )

        return (
            <h5 className='endListMessage noConfessions'>No forums found in this category</h5>
        )
    }

    const fetchMoreData = () => {
        dispatch(handleForums({ page: page + 1 }))
        getForums(page + 1, true)
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

            {forums.length > 0 ?
                <InfiniteScroll
                    scrollThreshold="80%"
                    endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Forums</div>}
                    dataLength={forums.length}
                    next={fetchMoreData}
                    hasMore={forums.length < count}
                    loader={
                        <div className="text-center mb-5">
                            <div className="spinner-border pColor text-center" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }
                >
                    {renderForums(forums)}
                </InfiniteScroll>
                :
                <h5 className='endListMessage noConfessions'>
                    No forums found in this category
                </h5>}



            {/* <div className="rightsideBarAdd">
                <RightSideAdComp />
            </div> */}

            {/* Modals */}

            {/* Send join request modal */}
            {requestToJoinModal.visible && <SendRequestModal />}

            {/* Report forum modal */}
            {reportForumModal.visible && <ReportForumModal />}

            {/* Nfsw alert modal */}
            {nfsw_modal.isVisible && <NfswAlertModal nfsw_modal={nfsw_modal} />}

        </div>
    )
}

export default WhatsNew