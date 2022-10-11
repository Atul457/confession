import React, { useEffect } from 'react'

// Custom components
import ForumLayoutWrapper from '../../../../components/forums/common/ForumLayoutWrapper';

// Redux
import { useDispatch, useSelector } from 'react-redux';

import Footer from '../../common/Footer';

import ForumComp from './ForumComp';
import ConfessionComp from './ConfessionComp';
import { apiStatus } from '../../../../helpers/status';
import { searchAcFn } from '../../../../redux/actions/searchAc/searchAc';
import { getForumsNConfessions } from '../../../../components/forums/services/forumServices';
import InfiniteScroll from 'react-infinite-scroll-component';


const Search = () => {

    // Hooks and vars
    const dispatch = useDispatch()
    const SearchReducer = useSelector(state => state.SearchReducer)
    const {
        data: posts,
        status: postStatus,
        message, searchStr,
        type = 0,
        page,
        hasMore
    } = SearchReducer
    const { forumTypes } = useSelector(state => state.forumsReducer)
    const confessionType = 1
    const forumType = 2

    console.log(posts)

    // Functions

    // Render forums
    const renderPost = postArr => {
        if (postArr && postArr.length) return (
            postArr.map((currPost, index) => {
                if (currPost?.pType === confessionType)
                    return <ConfessionComp
                        index={index}
                        cover_image={currPost.cover_image ?? ''}
                        is_viewed={currPost.is_viewed}
                        isRegistered={currPost.isRegistered}
                        isReported={currPost.isReported}
                        updateCanBeRequested={() => { }}
                        viewcount={currPost.viewcount}
                        handleCommentsModal={() => { }}
                        updateConfessionData={() => { }}
                        key={`fConf${index}`}
                        slug={currPost.slug}
                        createdAt={currPost.created_at}
                        post_as_anonymous={currPost.post_as_anonymous}
                        curid={currPost.user_id === '0' ? false : currPost.user_id}
                        category_id={currPost.category_id} profileImg={currPost.profile_image}
                        postId={currPost.confession_id}
                        imgUrl={currPost.image === '' ? '' : currPost.image}
                        userName={currPost.created_by}
                        category={currPost.category_name}
                        updatedConfessions={() => { }}
                        postedComment={currPost.description}
                        isNotFriend={currPost.isNotFriend}
                        like={currPost.like}
                        dislike={currPost.dislike}
                        is_liked={currPost.is_liked}
                        sharedBy={currPost.no_of_comments} />

                if (currPost?.pType === forumType)
                    return <ForumComp
                        dispatch={dispatch}
                        forum_index={index}
                        key={`forumNo${index}`}
                        actionBox={{}}
                        forumTypes={forumTypes}
                        currForum={currPost} />
            })
        )

        return (
            <h5 className='endListMessage noConfessions'>No Posts found</h5>
        )
    }


    const changeType = (type) => {
        dispatch(searchAcFn({
            type
        }))
    }

    useEffect(() => {
        getForumsNConfessions({ type, dispatch })
    }, [type])

    useEffect(() => {
        if (page > 1)
            getForumsNConfessions({ type, dispatch, append: true })
    }, [page])


    const fetchMoreData = () => {
        dispatch(searchAcFn({
            page: page + 1
        }))
    }


    return (
        <>
            <ForumLayoutWrapper>
                <div className='search_page'>

                    {searchStr?.trim().length > 0 ?
                        <div className="w-100 search_results_str">
                            Search Result for “{searchStr ?? ""}”
                        </div>
                        : null}

                    <div className="search_types_cont">
                        <div className={`search_type ${type === 0 ? "active" : ""}`}
                            onClick={() => changeType(0)}>
                            Top
                        </div>
                        <div className={`search_type ${type === 1 ? "active" : ""}`}
                            onClick={() => changeType(1)}>
                            Post
                        </div>
                        <div className={`search_type ${type === 2 ? "active" : ""}`}
                            onClick={() => changeType(2)}>
                            Forum
                        </div>
                        <div className={`search_type ${type === 3 ? "active" : ""}`}
                            onClick={() => changeType(3)}>
                            Tags
                        </div>
                    </div>

                    {posts ?
                        <div className='posts_wrapper'>
                            <InfiniteScroll
                                scrollThreshold="80%"
                                endMessage={<div className=" text-center endListMessage mt-4 pb-3">End of Posts</div>}
                                dataLength={posts.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                            >
                                {renderPost(posts)}
                            </InfiniteScroll>
                        </div>
                        :
                        null}
                </div>
            </ForumLayoutWrapper>
            <Footer />
        </>
    )
}

export default Search