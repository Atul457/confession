import React from 'react'

// Custom components
// import Header from "../../../user/pageElements/common/Header"
// AppLogo
// Header
// import SocialIconsComp from '../../SocialIconsComp/SocialIconsComp';
import ForumCategoriesAdmin from "../forumCategories/ForumCategoriesAdmin"

import { useLocation } from 'react-router-dom';
import AppLogo from '../../../../user/pageElements/components/AppLogo';
import Header from '../../../pageElements/common/Header';
import ForumPageWrapperAdmin from '../ForumPageWrapperAdmin';


const ForumLayoutWrapperAdmin = ({ children }) => {

    const location = useLocation()?.pathname.replace("/", "")
    const isForumPage = location.startsWith("forum")
    const isSearchPage = location.startsWith("search")

    return (
        <div className="container-fluid forums_page">
            {/* <div className="container-fluid forums_page"> */}
            <div className="row outerContWrapper">
                <Header links={true}></Header>

                {/* LeftSideCont */}
                <aside className="leftColumn leftColumnFeed">
                    <div className="leftColumnWrapper">
                        <AppLogo />
                        <div className="middleContLoginReg feedMiddleCont w-100">
                            {/* Categorycont */}
                            <aside className="posSticky">
                                <ForumCategoriesAdmin
                                    onlyForForums={isForumPage}
                                    isSearchPage={isSearchPage} />
                            </aside>
                        </div>

                    </div>
                </aside>

                {/* Rightsides comp */}
                <ForumPageWrapperAdmin>
                    {children}
                </ForumPageWrapperAdmin>
                {/* Rightsides comp */}

            </div>
        </div>
    )
}

export default ForumLayoutWrapperAdmin