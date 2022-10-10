import React from 'react'

// Custom components
import Header from "../../../user/pageElements/common/Header"
import AppLogo from '../../../user/pageElements/components/AppLogo';
import SocialIconsComp from '../../SocialIconsComp/SocialIconsComp';
import ForumMiddleCompWrapper from '../ForumPageWrapper';
import ForumCategories from '../forumCategories/ForumCategories';


const ForumLayoutWrapper = ({ children }) => {

    return (
        <div className="container-fluid forums_page">
            <div className="row outerContWrapper">
                <Header links={true}></Header>

                {/* LeftSideCont */}
                <aside className="leftColumn leftColumnFeed">
                    <div className="leftColumnWrapper">
                        <AppLogo />
                        <div className="middleContLoginReg feedMiddleCont w-100">
                            {/* Categorycont */}
                            <aside className="posSticky">
                                <ForumCategories />
                            </aside>
                        </div>

                        {/* Social links */}
                        <div className="leftSidebarFooter">
                            <SocialIconsComp />
                        </div>
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

export default ForumLayoutWrapper