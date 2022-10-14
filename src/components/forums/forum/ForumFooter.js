import React from 'react'

// Image imports
import commentCountIcon from '../../../images/commentCountIcon.svg';
import viewsCountIcon from '../../../images/viewsCountIcon.svg';

// Helpers
import auth from '../../../user/behindScenes/Auth/AuthCheck'

// Image imports
import pinIcon from '../../../images/pinIcon.svg';
import pinnedIcon from '../../../images/pinnedIcon.svg';

// Redux
import { pinForumService } from '../services/forumServices';
import { Link } from 'react-router-dom';


const ForumFooter = (props) => {

    // Hooks and vars
    const {
        viewcount,
        is_only_to_show = false,
        no_of_comments,
        forum_type,
        currForum,
        forum_id,
        forum_index,
        dispatch,
        isMyForumPage,
        isPinned,
        showPin,
        forum_tags } = props,
        forumTypeStyle = {
            background: forum_type.color_code,
            border: `1px solid ${forum_type?.color_code}`
        },
        showTagsSection = forum_tags.length

    // // Pins/Unpins the forum
    const pinForumFn = async () => {
        pinForumService({
            isPinned,
            forum_index,
            forum_id,
            dispatch
        })
    }

    return (
        <div className="postFoot forum_footer">
            <div className="forum_details_cont">
                <div className="type_view_and_com_count">
                    <Link className="links text-dark" to={`/forums/${currForum?.slug}`}>
                        <div className={`iconsCont ${!auth() ? 'mainDesignOnWrap' : ''}`}>
                            <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button">
                                <img src={viewsCountIcon} alt="" />
                                <span className="count">{viewcount ?? 0}</span>
                            </div>
                            <div className="upvote_downvote_icons_cont" type="button">
                                <img src={commentCountIcon} alt="" />
                                <span className="count">{no_of_comments}</span>
                            </div>
                        </div>
                    </Link>

                    <span
                        className="category_name forum_type"
                        style={forumTypeStyle}
                    >
                        {forum_type?.type_name}
                    </span>
                </div>

                {showTagsSection
                    ?
                    <div className="forum_tags_cont">
                        <span className="tags_label">
                            | Tags:
                        </span>

                        {forum_tags.map((currTag, index) => {
                            let key = `${forum_id}-${currTag?.color}${index}${forum_id}`
                            return <ForumTag
                                key={key}
                                currTag={currTag}
                            />
                        })}
                    </div>
                    :
                    null
                }
            </div>

            {(!is_only_to_show && showPin && !isMyForumPage) ? <span className="pinnForum" onClick={pinForumFn}>
                <img
                    src={!isPinned ? pinIcon : pinnedIcon}
                    alt="pin_forum_icon" />
            </span> : null}

        </div>
    )
}

const ForumTag = props => {

    // Hooks and vars
    const { currTag } = props,
        forumTagStyle = {
            background: currTag?.color,
            border: `1px solid ${currTag?.color}`
        }

    return (
        <span
            style={forumTagStyle}
            className='category_name forum_tag'>
            {currTag?.tag}
        </span>
    )
}

export default ForumFooter