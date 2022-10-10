import React, { useEffect } from 'react'

// Custom components
import RightSideComp from '../../../../components/forums/RightSideComp';
import ForumLayoutWrapper from '../../../../components/forums/common/ForumLayoutWrapper';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc';

import Footer from '../../common/Footer';


const Forums = () => {

    // Hooks and vars
    const dispatch = useDispatch()
    const forumsReducer = useSelector(state => state.forumsReducer?.forums)
    const { actionBox } = forumsReducer

    useEffect(() => {

        const clickHandler = e => {
            // if action box is visible hide it else do nothing
            let isActionIconClicked = e.target.classList
            isActionIconClicked = isActionIconClicked.contains("sharekitdots")

            if (!isActionIconClicked && ("forum_id" in actionBox || "forum_index" in actionBox))
                toggleForumAcboxFn()
        }
        document.addEventListener("click", clickHandler)
        return () => {
            document.removeEventListener("click", clickHandler)
        }
    }, [forumsReducer?.actionBox])


    // Functions
    const toggleForumAcboxFn = () => {
        dispatch(forumHandlers.handleForums({ actionBox: {} }))
    }

    return (
        <>
            <ForumLayoutWrapper>
                <RightSideComp />
            </ForumLayoutWrapper>
            <Footer />
        </>
    )
}

export default Forums