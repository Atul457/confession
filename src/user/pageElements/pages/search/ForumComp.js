import React from 'react'

// React router imports
import { Link } from 'react-router-dom';

// Custom components
import ForumFooter from '../../../../components/forums/forum/ForumFooter';
import ForumHeader from '../../../../components/forums/forum/ForumHeader';

const ForumComp = (props) => {
  // Hooks and vars
  const {
    currForum,
    forumTypes,
    actionBox,
    dispatch,
    forum_index } = props
  const { forum_id, is_pinned } = currForum
  const { data: types } = forumTypes
  const forum_type = {
    type_name: types[currForum?.type - 1]?.type_name,
    color_code: types[currForum?.type - 1]?.color_code
  }
  const isPinned = is_pinned === 1
  const slug = currForum?.slug
  const showPin = true
  const isActionBoxVisible = actionBox?.forum_id === forum_id
  const forumHeaderProps = {
    is_only_to_show: true,
    category_name: currForum?.category_name,
    created_at: currForum?.created_at,
    name: currForum?.title,
    forum_id: currForum?.forum_id,
    is_requested: currForum?.is_requested,
    isReported: currForum?.isReported,
    forum_index,
    type: currForum?.type,
    currForum,
    dispatch,
    actionBox,
    isActionBoxVisible,
    is_calledfrom_detailPage: false
  }

  const forumFooterProps = {
    no_of_comments: currForum?.no_of_comments,
    viewcount: currForum?.viewcount ?? 0,
    forum_type,
    isPinned,
    showPin,
    forum_tags: currForum?.tags,
    forum_id: currForum?.forum_id,
    forum_index,
    dispatch,
    currForum,
    is_only_to_show: true
  }


  // Functions

  return (
    <div className='postCont forum_cont'>
      <ForumHeader {...forumHeaderProps} />
      <div className="postedPost">
        <Link className="links text-dark" to={`/forums/${slug}`} state={{ cameFromSearch: true }}>
          <pre className="preToNormal post forum_desc">
            {currForum?.description}
          </pre>
        </Link>
      </div>
      <ForumFooter {...forumFooterProps} />
    </div>
  )
}

export default ForumComp