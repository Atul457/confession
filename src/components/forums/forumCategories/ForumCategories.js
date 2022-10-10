import React, { useEffect } from 'react'

// Redux 
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { forumHandlers } from '../../../redux/actions/forumsAc/forumsAc'

// Helpers
import { apiStatus } from '../../../helpers/status'


const ForumCategories = () => {

    // Hooks and vars
    const { categories: categoriesRed } = useSelector(state => state.forumsReducer),
        { data: categories, activeCategory } = categoriesRed,
        location = useLocation()?.pathname,
        navigate = useNavigate(),
        dispatch = useDispatch()

    useEffect(() => {
        dispatch(forumHandlers.handleCommentsAcFn({
            status: apiStatus.LOADING,
            data: [{
                subComments: {
                    status: apiStatus.IDLE,
                    data: [],
                    message: "",
                }
            }],
            message: ""
        }))
    }, [])

    return (
        <div className='row'>
            <div className="categoryHead col-12">
                Choose categories
            </div>
            <div className="categoriesContainer w-100">
                {categories.map((category, cindex) => {
                    return <Category
                        location={location}
                        activeCategory={activeCategory}
                        navigate={navigate}
                        key={`forumsCategory${cindex}${category?.id}`}
                        categoryName={category?.category_name}
                        cindex={cindex + 1} />
                })}
            </div>

            <div className={`col-12 pt-0 filterVerbiage`}>
                * Filter out forums by clicking on the categories above. Unselect the category to remove the filter.
            </div>
        </div>

    )
}

const Category = props => {

    const {
        categoryName,
        cindex,
        activeCategory,
        location,
        navigate
    } = props;
    const dispatch = useDispatch(),
        isActiveCategory = activeCategory === cindex,
        forumHomePageLink = "/forums",
        isForumHomePage = location === forumHomePageLink

    const switchCategory = categoryToActivate => {
        let isSameCatClicked = activeCategory === categoryToActivate,
            allCategories = 0;
        categoryToActivate = isSameCatClicked ? allCategories : categoryToActivate
        dispatch(forumHandlers.handleForumCatsAcFn({ activeCategory: categoryToActivate }))
        if (!isForumHomePage) {
            navigate(forumHomePageLink)
        }
    }

    return (
        <button
            className={`category ${isActiveCategory ? "activeCategory" : ""}`}
            type='button'
            onClick={() => switchCategory(cindex)}
            id={`forumCat${cindex}`}>
            {categoryName?.toLowerCase()}
        </button>
    )
}

export default ForumCategories