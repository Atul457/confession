import React, { useRef, useState, useEffect } from 'react';
import userIcon from '../../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import forwardIcon from '../../../images/forwardIcon.png';
import editCommentIcon from '../../../images/editCommentIcon.png';
import TextareaAutosize from 'react-textarea-autosize';
import { fetchData } from '../../../commonApi';
import DateConverter from '../../../helpers/DateConverter';


export default function Comments(props) {

    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [editedComment, setEditedComment] = useState("");
    const [toggleTextarea, setToggleTextarea] = useState(false);
    const [requiredError, setRequiredError] = useState('');
    const editCommentField = useRef(null);

    useEffect(() => {
        if (toggleTextarea) {
            editCommentField.current.focus();
        }
    }, [toggleTextarea])


    const setComment = () => {
        setToggleTextarea(true);
        setEditedComment(props.postedComment);
    }


    const updateComment = () => {
        let commentData;
        commentData = {
            comment_id: props.commentId,
            comment: editedComment
        }
        if (editedComment.trim() === "") {
            setRequiredError("This is required field");
        } else {
            setRequiredError("");
            props.updateComment(commentData);
            setToggleTextarea(false);
        }
    }


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const betterCheckKeyPressed = () => {
        var timer;
        return (event) => {
            if (window.innerWidth > 767) {
                if (event.keyCode === 13 && !event.shiftKey) {
                    event.preventDefault();
                    //PREVENTS DOUBLE MESSAGE SEND
                    clearInterval(timer);
                    timer = setTimeout(() => {
                        updateComment();
                    }, 100);
                }
            }
        }
    }


    const deleteCommentFunc = async () => {

        let confessionId = props.postId;
        let commentId = props.commentId;
        
        let obj = {
            data: {},
            token: userDetails.token,
            method: "get",
            url: `deletecomment/${confessionId}/${commentId}`,
        }

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                props.updateComments(commentId);
            }
        } catch (error) {
            console.log(error);
        }

    }


    const checkKeyPressed = betterCheckKeyPressed();

    return (
        <div className="postCont overWritePostWithComment">
            <div className="postContHeader commentsContHeader">
                <span className="commentsGotProfileImg">
                    <img src={props.imgUrl === "" ? userIcon : props.imgUrl} alt="" />
                </span>

                {props.curid !== false ?

                    (<Link className={`textDecNone`}
                        to={props.curid ?
                            (auth() ? (userDetails.profile.user_id === props.curid ? `/profile` : `/userProfile/${props.curid}`) : `/userProfile/${props.curid}`)
                            : ''}>
                        <span className="userName">
                            {props.userName}
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

                {props.is_editable === 1  &&
                    <div className='editDelComment'>
                        <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                        {toggleTextarea === false && <img src={editCommentIcon} className='editCommentIcon' onClick={setComment} />}
                    </div>
                }

            </div>
            <div className="postBody">
                <div className="postedPost">
                    <pre className="preToNormal">
                        {toggleTextarea === false && props.postedComment}
                        {toggleTextarea === true &&
                            <>
                                <div className="container-fluid inputWithForwardCont">
                                    <div className="inputToAddComment textAreaToComment">
                                        <TextareaAutosize
                                            type="text"
                                            ref={editCommentField}
                                            value={editedComment}
                                            onKeyDown={(e) => checkKeyPressed(e)}
                                            maxLength="2000"
                                            onChange={(e) => { setEditedComment(e.target.value) }}
                                            className="form-control my-1">
                                        </TextareaAutosize>
                                    </div>
                                    <div className="arrowToAddComment" type="button">
                                        <img src={forwardIcon} className="forwardIconContImg" onClick={updateComment} />
                                    </div>
                                </div>
                                <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError}</span>
                            </>
                        }
                    </pre>
                </div>
            </div>
        </div>
    )
}
