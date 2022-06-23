import React, { useRef, useState, useEffect } from 'react';
import userIcon from '../../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import forwardIcon from '../../../images/forwardIcon.png';
import editCommentIcon from '../../../images/editCommentIcon.png';
import TextareaAutosize from 'react-textarea-autosize';
import DateConverter from '../../../helpers/DateConverter';
import { setCommentField, setUpdateFieldCModal, updateCModalState } from '../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import commentReplyIcon from '../../../images/creplyIcon.svg';
import { fetchData } from '../../../commonApi';
import { getToken } from '../../../helpers/getToken';
import _ from 'lodash';


const SubComments = ({ data, subcommentId, updatSubComments, index,
    root_id, addNewSubComment, deleteSubComment }) => {

    let props = data;
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [editedComment, setEditedComment] = useState("");
    const [requiredError, setRequiredError] = useState({ updateError: '', replyError: '' });
    const editCommentField = useRef(null);
    const dispatch = useDispatch();
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);

    useEffect(() => {
        if (commentsModalReducer.updateField.comment_id === props.comment_id) {
            editCommentField.current.focus();
        }
    }, [commentsModalReducer.updateField.comment_id])


    useEffect(() => {
        if (commentsModalReducer.commentField.comment_id === props.comment_id) {
            let ref = document.querySelector(`#sendSubComment${props.comment_id}`)
            ref.focus();
        }
    }, [commentsModalReducer.commentField.comment_id])


    const setComment = () => {
        if (requiredError.updateError !== '')
            setRequiredError({ ...requiredError, updateError: "" });
        dispatch(setCommentField({ id: "" }));
        dispatch(setUpdateFieldCModal({ comment_id: props.comment_id }));
        setEditedComment(props.comment);
    }


    const updateComment = () => {
        if (editedComment.trim() === "") {
            setRequiredError({ ...requiredError, updateError: "This is required field" });
        } else {
            setRequiredError({ ...requiredError, updateError: "" });
            updatSubComments(props.comment_id, editedComment, index);
        }
    }



    const sendSubComment = async () => {
        let ref, token, commentData, obj;
        ref = document.querySelector(`#sendSubComment${subcommentId}`);

        if (ref.value.trim() === '')
            return setRequiredError({ ...requiredError, replyError: "This is required field" });

        commentData = {
            confession_id: commentsModalReducer.state?.postId,
            comment: ref.value,
            parent_id: subcommentId,
            root_id
        }

        token = getToken()
        obj = {
            data: commentData,
            token: token,
            method: "post",
            url: "postcomment"
        }

        try {
            const response = await fetchData(obj);
            if (response.data.status === true) {
                let data;
                addNewSubComment(response.data.comment);
                data = { no_of_comments: commentsModalReducer.state.no_of_comments + 1 }
                dispatch(updateCModalState(data))
                dispatch(setCommentField({ id: "" }));
            } else {
                return setRequiredError({ ...requiredError, replyError: response.data.message });
            }
        } catch (error) {
            console.log(error);
        }

    }


    const sendSubCommentDebounced = _.debounce(sendSubComment, 500);


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event, comment) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                // 0 MEANS UPDATE THE PARENT COMMENT
                // 1 MEANS ADD A NEW COMMENT
                if (comment === 0) {
                    updateComment();
                } else {
                    sendSubCommentDebounced();
                }
            }
        }
    }


    const deleteCommentFunc = async () => {

        let indexArr = [], confessionId, commentId;
        const ids = document.querySelectorAll(`.abc${props.comment_id}`);
        ids.forEach(curr => indexArr.push(curr.getAttribute("index")))
        indexArr = [...new Set(indexArr)]
        indexArr = indexArr.reverse();

        confessionId = commentsModalReducer.state?.postId;
        commentId = props.comment_id;

        let obj = {
            data: {},
            token: getToken(),
            method: "get",
            url: `deletecomment/${confessionId}/${commentId}`,
        }

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                deleteSubComment([...indexArr, index]);
            } else {
                setRequiredError({ ...requiredError, updateError: res.data.message });
            }
        } catch (error) {
            console.log(error);
        }

    }

    const openCommentBox = () => {
        if (subcommentId === commentsModalReducer.commentField.comment_id) {
            setRequiredError({ ...requiredError, replyError: "" });
            return dispatch(setCommentField({ id: "" }));
        }

        if (requiredError.replyError !== '')
            setRequiredError({ ...requiredError, replyError: "" });

        dispatch(setCommentField({ id: subcommentId }));
        dispatch(setUpdateFieldCModal({ comment_id: "" }));
    }


    return (
        <div className={`postCont overWritePostWithComment subcommentCont ${props.id_path}`} index={index}>
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
                                        <img src={forwardIcon}
                                            className="forwardIconContImg"
                                            onClick={updateComment}
                                        />
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
                            <>
                                <div className='inputToAddSubComment textAreaToComment mt-md-2'>
                                    <TextareaAutosize
                                        type="text"
                                        onKeyDown={(e) => checkKeyPressed(e, 1)}
                                        maxLength="2000"
                                        id={`sendSubComment${props.comment_id}`}
                                        placeholder='Sub comment'
                                        className="form-control">
                                    </TextareaAutosize>

                                    <div
                                        className="arrowToAddComment"
                                        type="button"
                                        onClick={sendSubCommentDebounced}
                                    >
                                        <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                    </div>
                                </div>
                            </>

                        }
                        <span className="d-block errorCont text-danger mb-0 mt-2 moveUp">{requiredError.replyError}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubComments