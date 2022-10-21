import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { ExpandableForumCats } from './forumCategories/ForumCategories'
import MyForums from './forumPageComp/MyForums'
import WhatsNew from './forumPageComp/WhatsNew'
import CreateFormModal from "../modals/CreateFormModal"


const RightSideComp = () => {

    const [activeTab, setActiveTab] = useState(0)
    const TabComps = [<WhatsNew />, <MyForums />]
    const { modals } = useSelector(state => state.forumsReducer)
    const { createForumModal } = modals
    const { handleForums } = forumHandlers
    const ActiveTab = TabComps[activeTab]
    const dispatch = useDispatch()


    const changeActiveTab = (activeTabIndex) => {
        setActiveTab(activeTabIndex)
        dispatch(handleForums({
            status: apiStatus.LOADING,
            data: [],
            message: "",
            actionBox: {},
            page: 1,
            count: 0
        }))
    }

    return (
        <>
            <Tabs activeTab={activeTab} setActiveTab={changeActiveTab} />

            <ExpandableForumCats classNames='mb-3 d-block d-md-none' onlyForForums={true}/>

            <div className='forums_tabs_comps_holder'>
                {ActiveTab}
            </div>

            {/* Create forum modal */}
            {createForumModal.visible && <CreateFormModal />}

        </>
    )
}

const Tabs = ({ activeTab, setActiveTab }) => {

    // Hooks and vars
    let tabs = ["What's New", "My Forums"]
    const dispatch = useDispatch()

    // Functions
    const changeTab = tabIndex => {
        setActiveTab(tabIndex)
    }

    const openCreateSForumModal = () => {
        dispatch(createForumModalFnAc({
            visible: true
        }))
    }

    return (

        <div className='forum_tabs_cont'>
            <div className="links_cont">
                {tabs.map((currTab, ctIndex) => {
                    return (
                        <span
                            key={`forumsTab${ctIndex}`}
                            onClick={() => changeTab(ctIndex)}
                            className={`forums_tab ${activeTab === ctIndex ? "active" : ''}`}>
                            {currTab}
                        </span>
                    )
                })}
            </div>

            <div
                onClick={openCreateSForumModal}
                className="doPostBtn create_forum_btn"
                type="button">
                <i className="fa fa-plus text-white pr-1" aria-hidden="true"></i> Add New Forums
            </div>

        </div >
    )
}

export default RightSideComp