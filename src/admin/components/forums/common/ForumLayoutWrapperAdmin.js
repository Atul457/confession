import React from 'react'

// Custom components
import ForumCategoriesAdmin from "../forumCategories/ForumCategoriesAdmin"
import Header from '../../../pageElements/common/Header';
import AppLogo from '../../../../user/pageElements/components/AppLogo';
import ForumPageWrapperAdmin from '../ForumPageWrapperAdmin';


const ForumLayoutWrapperAdmin = ({ children }) => {

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
                                <ForumCategoriesAdmin />
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