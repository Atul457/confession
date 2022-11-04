import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { ExpandableForumCats } from './forumCategories/ForumCategories'
import MyForums from './forumPageComp/MyForums'
import WhatsNew from './forumPageComp/WhatsNew'
import CreateFormModal from "../modals/CreateFormModal"
import auth from '../../user/behindScenes/Auth/AuthCheck'
import { useNavigate } from 'react-router-dom'


const RightSideComp = () => {

    const TabComps = [<WhatsNew />, <MyForums />]
    const { modals, forums: { activeTab } } = useSelector(state => state.forumsReducer)
    const { createForumModal } = modals
    const { handleForums } = forumHandlers
    const ActiveTab = TabComps[activeTab]
    const myForumsIndex = 1
    const dispatch = useDispatch()

    const changeActiveTab = (activeTabIndex) => {
        if (activeTab !== activeTabIndex)
            dispatch(handleForums({
                status: apiStatus.LOADING,
                data: [],
                message: "",
                actionBox: {},
                page: 1,
                count: 0,
                activeTab: activeTabIndex
            }))
    }

    return (
        <>
            <Tabs activeTab={activeTab} setActiveTab={changeActiveTab} />

            {activeTab !== myForumsIndex ?
                <ExpandableForumCats classNames='mb-3 d-block d-md-none' onlyForForums={true} /> : null}

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
    let tabs = ["What's New", ...(auth() ? ["My Forums"] : [])]
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Functions
    const changeTab = tabIndex => {
        setActiveTab(tabIndex)
    }

    const openCreateSForumModal = () => {
        if (!auth) navigate("/login")
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

            {auth() ?
                <div
                    onClick={openCreateSForumModal}
                    className="doPostBtn create_forum_btn"
                    type="button">
                    <i className="fa fa-plus text-white pr-1 d-md-inline-block d-none" aria-hidden="true"></i>
                    Add New <span className='d-md-inline-block d-none pl-1'>Forums</span>
                </div> : null}

        </div >
    )
}

export default RightSideComp