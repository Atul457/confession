import React from 'react';
import forwardIcon from '../images/forwardIcon.svg';
import { Link } from "react-router-dom";

export default function ProfilePosts(props) {
    return (
        <div className="postCont">
            <div className="postContHeader">
                <span className="userImage">
                    <img src={props.imgUrl} className="userAccIcon" alt="" />
                </span>
                <span className="userName">
                    {props.userName}
                </span>
                <span className="catCommentBtnCont">
                    <div className="categoryOfUser" type="button">{props.category}</div>
                </span>
            </div>
            <div className="postBody">
                <div className="postedPost">
                    {props.postedComment} <Link to="#"><span className="viewMoreBtn">View More</span></Link>
                </div>

                <div className="container-fluid inputWithForwardCont">
                    <div className="col-10 inputToAddComment">
                        <input type="text" className="form-control my-3" placeholder="Share your thoughts about this......" />
                    </div>
                    <div className="col-2">
                        <img src={forwardIcon} alt="" className="forwardIconContImg" />
                    </div>
                </div>
            </div>

            <div className="postFoot">
                <div className="totalComments">
                    {props.sharedBy} - People shared their thoughts about this post
                </div>
            </div>
        </div>
    )
}
