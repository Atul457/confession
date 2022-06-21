import React, { useRef, useState, useEffect } from 'react';
import userIcon from '../../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import forwardIcon from '../../../images/forwardIcon.png';
import editCommentIcon from '../../../images/editCommentIcon.png';
import TextareaAutosize from 'react-textarea-autosize';
// import { fetchData } from '../../../commonApi';
import DateConverter from '../../../helpers/DateConverter';
import { setCommentField, setUpdateFieldCModal } from '../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import commentReplyIcon from '../../../images/creplyIcon.svg';


const SubComments = ({ data, subcommentId, updatSubComments }) => {

    let props = data;
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [editedComment, setEditedComment] = useState("");
    const [toggleTextarea, setToggleTextarea] = useState(false);
    const [requiredError, setRequiredError] = useState({ updateError: '', replyError: '' });
    const editCommentField = useRef(null);
    const dispatch = useDispatch();
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);

    useEffect(() => {
        if (commentsModalReducer.updateField.comment_id === props.comment_id) {
            editCommentField.current.focus();
        }
    }, [commentsModalReducer.updateField.comment_id])


    const setComment = () => {
        if (requiredError.updateError !== '')
            setRequiredError({ ...requiredError, updateError: "" });
        dispatch(setCommentField({ id: "" }));
        dispatch(setUpdateFieldCModal({ comment_id: props.comment_id }));
        console.log(props);
        setEditedComment(props.comment);
    }


    const updateComment = () => {

        let commentData;

        commentData = {
            comment_id: props.comment_id,
            comment: editedComment
        }

        if (editedComment.trim() === "") {
            setRequiredError({ ...requiredError, updateError: "This is required field" });
        } else {
            setRequiredError({ ...requiredError, updateError: "" });
            updatSubComments(commentData);
            dispatch(setUpdateFieldCModal({ comment_id: "" }));
        }

    }


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const betterCheckKeyPressed = () => {
        var timer;
        return (event, comment) => {
            if (window.innerWidth > 767) {
                if (event.keyCode === 13 && !event.shiftKey) {
                    event.preventDefault();
                    //PREVENTS DOUBLE MESSAGE SEND
                    clearInterval(timer);
                    timer = setTimeout(() => {
                        // 0 MEANS UPDATE THE PARENT COMMENT
                        // 1 MEANS ADD A NEW COMMENT
                        console.log({ comment });
                        if (comment === 0) {
                            return updateComment();
                        } else {
                            // sendSubComment();
                        }
                    }, 100);
                }
            }
        }
    }


    const deleteCommentFunc = async () => {

        // let confessionId = props.postId;
        // let commentId = props.commentId;

        // let obj = {
        //     data: {},
        //     token: userDetails.token,
        //     method: "get",
        //     url: `deletecomment/${confessionId}/${commentId}`,
        // }

        // try {
        //     const res = await fetchData(obj)
        //     if (res.data.status === true) {
        //         props.updateComments(commentId);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }

    }

    const openCommentBox = () => {
        if (subcommentId === commentsModalReducer.commentField.comment_id) {
            return dispatch(setCommentField({ id: "" }));
        }

        dispatch(setCommentField({ id: subcommentId }));
    }

    const checkKeyPressed = betterCheckKeyPressed();

    return (
        <div className="postCont overWritePostWithComment subcommentCont">
            <div className="postContHeader commentsContHeader">
                <span className="commentsGotProfileImg">
                    <img src={props.profile_image === "" ? userIcon : props.profile_image} alt="" />
                </span>

                {props.curid !== false ?

                    (<Link className={`textDecNone`}
                        to={props.curid ?
                            (auth() ? (userDetails.profile.user_id === props.curid ? `/profile` : `/userProfile/${props.curid}`) : `/userProfile/${props.curid}`)
                            : ''}>
                        <span className="userName">
                            {props.comment_by}
                        </span>
                    </Link>)
                    :
                    (<span className="userName">
                        {props.userName}
                    </span>)}

                <span className="postCreatedTime">
                    {/* {props.created_at} */}
                    {DateConverter(props.created_at)}
                </span>

                {props.is_editable === 1 &&
                    <div className='editDelComment'>
                        <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                        {commentsModalReducer.updateField.comment_id !== props.comment_id ? <img src={editCommentIcon} className='editCommentIcon' onClick={setComment} /> : ''}
                    </div>
                }

            </div>
            <div className="postBody">
                <div className="postedPost">
                    <pre className="preToNormal">
                        {commentsModalReducer.updateField.comment_id !== props.commentId && props.comment}
                        {commentsModalReducer.updateField.comment_id === props.comment_id &&
                            <>
                                <div className="container-fluid inputWithForwardCont">
                                    <div className="inputToAddComment textAreaToComment">
                                        <TextareaAutosize
                                            type="text"
                                            ref={editCommentField}
                                            value={editedComment}
                                            onKeyDown={(e) => checkKeyPressed(e, 0)}
                                            maxLength="2000"
                                            onChange={(e) => { setEditedComment(e.target.value) }}
                                            className="form-control my-1">
                                        </TextareaAutosize>
                                    </div>
                                    <div className="arrowToAddComment" type="button">
                                        <img src={forwardIcon} className="forwardIconContImg" onClick={updateComment} />
                                    </div>
                                </div>
                                <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError.updateError}</span>
                            </>
                        }
                    </pre>

                    <div className="replyCont">
                        <span onClick={openCommentBox}>
                            <img src={commentReplyIcon} alt="" />
                            <span className='pl-2'>Reply</span>
                        </span>

                        {commentsModalReducer.commentField.comment_id === subcommentId &&
                            <TextareaAutosize
                                type="text"
                                onKeyDown={(e) => checkKeyPressed(e, 1)}
                                maxLength="2000"
                                placeholder='Sub comment'
                                className="form-control">
                            </TextareaAutosize>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubComments