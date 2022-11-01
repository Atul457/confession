import React from 'react'
import WhatsNew from './forumPageComp/WhatsNewAdmin'
import { ExpandableForumCatsAdmin } from './forumCategories/ForumCategoriesAdmin'


const RightSideCompAdmin = () => {

    return (
        <>
            <ExpandableForumCatsAdmin classNames='mb-3 d-block d-md-none' onlyForForums={true} />

            <div className='forums_tabs_comps_holder'>
                <WhatsNew />
            </div>
        </>
    )
}

export default RightSideCompAdmin