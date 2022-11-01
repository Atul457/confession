import React from 'react'

// Custom components
// import Header from "../../../user/pageElements/common/Header"
// AppLogo
// Header
// import SocialIconsComp from '../../SocialIconsComp/SocialIconsComp';
import ForumMiddleCompWrapper from '../ForumPageWrapper';
import ForumCategories from '../forumCategories/ForumCategoriesAdmin';

import { useLocation } from 'react-router-dom';
import AppLogo from '../../../../user/pageElements/components/AppLogo';
import Header from '../../../pageElements/common/Header';


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
                                <ForumCategories
                                    onlyForForums={isForumPage}
                                    isSearchPage={isSearchPage} />
                            </aside>
                        </div>

                        {/* Social links */}
                        {/* <div className="leftSidebarFooter">
                            <SocialIconsComp />
                        </div> */}
                    </div>
                </aside>

                {/* Rightsides comp */}
                <ForumMiddleCompWrapper>
                    {children}
                </ForumMiddleCompWrapper>
                {/* Rightsides comp */}

            </div>
        </div>
    )
}

export default ForumLayoutWrapperAdmin