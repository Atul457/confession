import React, { useState } from 'react';
import upvote from '../../../../images/upvote.svg';
import commentCountIcon from '../../../../images/commentCountIcon.svg';
import viewsCountIcon from '../../../../images/viewsCountIcon.svg';
import upvoted from '../../../../images/upvoted.svg';
import { Link } from "react-router-dom";
import userIcon from '../../../../images/userAcc.svg';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import canBeRequested from "../../../../images/canBeRequested.svg";
import alRequested from "../../../../images/alRequested.svg";
import alFriends from "../../../../images/alFriends.svg";
import auth from '../../../behindScenes/Auth/AuthCheck';
import DateConverter from '../../../../helpers/DateConverter';


const ConfessionComp = (props) => {

  const authenticated = useState(auth());
  const { currPost } = props
  const noOfWords = useState(200);    //IN POST AFTER THESE MUCH CHARACTERS SHOWS VIEWMORE BUTTON
  const [lightBox, setLightBox] = useState(false);
  const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
  const isCoverTypePost = props.category_id === 0
  const postBg = isCoverTypePost ? {
    backgroundImage: `url('${props?.cover_image}')`,
    name: "post"
  } : {}
  const isAnyUnreadComment = props?.unread_comments && props?.unread_comments > 0

  const ProfileIcon = (profileImg, isNotFriend) => {

    // isNotFriend :
    // 0 : SHOW NOTHING
    // 1 : SHOW REQUEST
    // 2: SHOW CANCEL 
    // 3: ALREADY FRIEND
    // 4: SHOW REQUEST ICON IF NOT LOGGED IN 

    let profileImage, profileBPlate;

    profileImage = profileImg !== '' ? profileImg : userIcon;

    const getHtml = () => {

      if (isNotFriend === 1) {
        return <>
          <img
            src={canBeRequested}
            type="button"
            alt=""
            className='registeredUserIndicator' />
          <img
            src={props.profileImg !== '' ? props.profileImg : userIcon}
            className="userAccIcon generated"
            alt=""
          />
        </>
      }

      if (isNotFriend === 2) {
        return <>
          <img
            src={alFriends}
            type="button"
            alt=""
            className='registeredUserIndicator' />
          <img
            src={props.profileImg !== '' ? props.profileImg : userIcon}
            className="userAccIcon"
            alt=""
          />
        </>
      }

      if (isNotFriend === 3) {
        return <>
          <img
            src={alRequested}
            type="button"
            alt=""
            className='registeredUserIndicator' />
          <img
            src={props.profileImg !== '' ? props.profileImg : userIcon}
            className="userAccIcon"
            alt=""
          />
        </>
      }

      if (isNotFriend === 4) {
        return (
          <>
            {!auth() ? <Link to="/login">
              <img
                src={canBeRequested}
                type="button"
                alt=""
                className='registeredUserIndicator' />
              <img
                src={props.profileImg !== '' ? props.profileImg : userIcon}
                className="userAccIcon generated"
                alt=""
              />
            </Link> :
              <>
                <img
                  src={canBeRequested}
                  type="button"
                  alt=""
                  className='registeredUserIndicator' />
                <img
                  src={props.profileImg !== '' ? props.profileImg : userIcon}
                  className="userAccIcon generated"
                  alt=""
                />
              </>}
          </>
        )
      }

      return <img src={profileImage} className="userAccIcon" alt="" />
    }


    profileBPlate = getHtml();
    return profileBPlate;
  }


  const visitePrevilage = (isAnonymous) => {
    let isMyProfile = false;
    let isUserProfile = false;
    let isMyPost = false;
    let linkToVisit = "#";
    let html = "";

    if (auth()) {
      isMyPost = userDetails.profile.user_id === currPost.user_id
    }

    isMyProfile = isMyPost && isAnonymous === 0;
    isUserProfile = currPost?.userslug && isAnonymous === 0 && !isMyPost;

    if (isMyProfile)
      linkToVisit = "/profile"
    if (isUserProfile)
      linkToVisit = `/userProfile/${currPost?.userslug}`

    html = <Link className={`textDecNone postUserName`}
      to={linkToVisit}>
      <span className="userName">
        {props.userName}
      </span>
    </Link>

    return html;
  }


  return (
    <div className="postCont" index={props.index}>
      <div className="postContHeader">
        {lightBox && (
          props.imgUrl && ((props.imgUrl).length !== 0 && ((props.imgUrl).length > 1
            ?
            (<Lightbox images={props.imgUrl} onClose={() => { setLightBox(false) }} />)     //MULTIPLE IMAGES
            :
            (<Lightbox image={props.imgUrl} onClose={() => { setLightBox(false) }} />)))    //SINGLE IMAGE
        )}

        <span className="leftContofPostCont">
          <span className="userImage userImageFeed">
            {ProfileIcon(props.profileImg, props.isNotFriend)}
          </span>

          {/* NOT ANONYMOUS :: OPENS CURRENT LOGGED IN USER'S PROFILE,
                IF THE POST IS POSTED BY THE LOGGED IN USER, AND HE HAD NOT POSTED THE POST AS ANONYMOUS,
                ELSE THIS WILL OPEN THE PROFILE OF THE USER, WHO HAVE POSTED THE POST, NOT AS ANONYMOUS
                    
                ANONYMOUS :: WILL NOT DO ANY THING
                */}
          {visitePrevilage(props.curid, props.post_as_anonymous)}

          {!isCoverTypePost && <span className="catCommentBtnCont">
            <div className="categoryOfUser">{(props.category).charAt(0) + (props.category).slice(1).toLowerCase()}</div>
          </span>}

          <span className="postCreatedTime">
            {DateConverter(props.createdAt)}
          </span>

        </span>

        {/* SHOWS UNREAD COMMENTS ON POST */}
        {
          (props.unread_comments && props.unread_comments !== 0) ?
            <span className="unreadPostCommentCount">
              {props.unread_comments} {props?.unread_comments === 1 ? "New Reply" : "New Replies"}
            </span>
            : ''}
      </div>
      <Link className="links text-dark" to={`/confession/${props?.slug}`} state={{ cameFromSearch: true }}>
        <div
          className={`postBody ${isCoverTypePost ? 'coverTypePost' : ''} ${isAnyUnreadComment ? 'addMargin' : ''}`}
          style={postBg}>
          <div className="postedPost mb-2">
            <>
              <pre
                className="preToNormal post"
              >
                {props.postedComment}
              </pre>
              {
                ((props.postedComment).split("")).length >= noOfWords[0]
                  ||
                  (props.postedComment).split("\n").length > 5 ?
                  <>
                    {((props.postedComment).split("")).length >= noOfWords[0] && (props.postedComment).split("\n").length < 5 && <span className='ellipsesStyle'>... </span>}<span toberedirectedto={props.postId} className="viewMoreBtn pl-1">view more</span>
                  </> : ''
              }
            </>
          </div>

          {/* IF IMG URL WILL BE STRING THEN IMAGES WILL NOT BE SHOWN */}
          {(props.imgUrl !== null && (props.imgUrl).length > 0 && typeof (props.imgUrl) !== 'string')
            &&
            <div className="form-group imgPreviewCont mt-2 mb-0">
              <div className="imgContForPreviewImg fetched" type="button" onClick={() => { setLightBox(true) }}>
                {(props.imgUrl).map((srcg, index) => {

                  return (
                    <span className="uploadeImgWrapper fetched" key={`uploadeImgWrapper${index}`}>
                      <img key={"srcg" + index} src={srcg} alt="" className='previewImg' />
                    </span>
                  )
                })}
              </div>
            </div>
          }

        </div>
      </Link>

      <div className="postFoot">

        {authenticated[0] === false &&
          <span className="feedPageLoginBtnCont postLoginBtnCont">
            <Link to="/login">
              <div className="categoryOfUser enhancedStyle mb-0" type="button">
                Login to comment
              </div>
            </Link>
          </span>}

        <Link className="links text-dark" to={`/confession/${props?.slug}`} state={{ cameFromSearch: true }}>
          <div className={`iconsCont ${authenticated[0] === false ? 'mainDesignOnWrap' : ''}`}>
            <div className="upvote_downvote_icons_cont underlineShareCount ml-0" type="button">
              <img src={viewsCountIcon} alt="" />
              <span className="count">{props.viewcount ? props.viewcount : 0}</span>
            </div>
            <div className="upvote_downvote_icons_cont" type="button">
              <img src={commentCountIcon} alt="" />
              <span className="count">{props.sharedBy}</span>
            </div>

            {(props.hasOwnProperty("is_liked")
              ?
              <div className='iconsMainCont'>
                <div className={`upvote_downvote_icons_cont buttonType`}>
                  {props.is_liked === 1 ?
                    <img src={upvoted} alt="" /> :
                    <img src={upvote} alt="" />}
                  <span className='count'>{props.like}</span>
                </div>
              </div>
              :
              <div className='iconsMainCont'>
                <div className={`upvote_downvote_icons_cont`}>
                  <img src={upvote} alt="" />
                  <span className='count'>{props.like}</span>
                </div>
              </div>
            )
            }
          </div>
        </Link>
      </div>

    </div>
  )
}

export default ConfessionComp