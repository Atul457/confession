import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { apiStatus } from '../../helpers/status'
import { createForumModalFnAc, forumHandlers } from '../../redux/actions/forumsAc/forumsAc'
import { ExpandableForumCats } from './forumCategories/ForumCategories'
import MyForums from './forumPageComp/MyForums'
import WhatsNew from './forumPageComp/WhatsNew'


const RightSideComp = () => {

    const [activeTab, setActiveTab] = useState(0)
    const [adSlots, setAdSlots] = useState([]);
    const TabComps = [<WhatsNew slotsDetails={{ adSlots, setAdSlots }} />, <MyForums />]
    const { handleForums } = forumHandlers
    const ActiveTab = TabComps[activeTab]
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(handleForums({
            status: apiStatus.LOADING,
            data: [],
            message: "",
            actionBox: {},
            page: 1,
            count: 0
        }))
    }, [activeTab])

    return (
        <>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <ExpandableForumCats classNames='mb-3 d-block d-md-none' />

            <div className='forums_tabs_comps_holder'>
                {ActiveTab}
            </div>

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

            {activeTab == 1 ?
                <div
                    onClick={openCreateSForumModal}
                    className="doPostBtn create_forum_btn"
                    type="button">
                    <i className="fa fa-plus text-white pr-1" aria-hidden="true"></i> Add New Forums
                </div>
                : null}

        </div >
    )
}

export default RightSideComp