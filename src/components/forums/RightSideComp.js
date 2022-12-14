import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { ExpandableForumCats } from './forumCategories/ForumCategories'
import MyForums from './forumPageComp/MyForums'
import WhatsNew from './forumPageComp/WhatsNew'
import CreateFormModal from "../modals/CreateFormModal"
import auth from '../../user/behindScenes/Auth/AuthCheck'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"


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
    let tabs = ["What's New", "My Forums"]
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
                    if (!auth() && ctIndex === 1) {
                        return (
                            <span
                                key={`forumsTab${ctIndex}`}
                                onClick={() => navigate("/login")}
                                className={`forums_tab ${activeTab === ctIndex ? "active" : ''}`}>
                                {currTab}
                            </span>
                        )
                    }
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

            {
                auth() ?
                    (<div
                        onClick={openCreateSForumModal}
                        className="doPostBtn create_forum_btn"
                        type="button">
                        <i className="fa fa-plus text-white pr-1 d-md-inline-block" aria-hidden="true"></i>
                        New <span className='d-md-inline-block pl-1'>Forum</span>
                    </div>)
                    : (
                        <Link to="/login" className="doPostBtn create_forum_btn" >
                            <i className="fa fa-plus text-white pr-1 d-md-inline-block" aria-hidden="true"></i>
                            New <span className='d-md-inline-block pl-1'>Forum</span>
                        </Link>
                    )
            }

        </div >
    )
}

export default RightSideComp