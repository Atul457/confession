import React, { useRef, useState, useEffect } from 'react';
import userIcon from '../../../images/userAcc.png';
import verifiedIcon from '../../../images/verifiedIcon.svg';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import forwardIcon from '../../../images/forwardIcon.svg';
import editCommentIcon from '../../../images/editCommentIcon.svg';
import TextareaAutosize from 'react-textarea-autosize';
import DateConverter from '../../../helpers/DateConverter';
import { closeCModal, setCommentField, setUpdateFieldCModal, updateCModalState } from '../../../redux/actions/commentsModal';
import { useDispatch, useSelector } from 'react-redux';
import commentReplyIcon from '../../../images/creplyIcon.svg';
import { fetchData } from '../../../commonApi';
import { getToken } from '../../../helpers/getToken';
import _ from 'lodash';
import { toggleReportComModal } from '../../../redux/actions/reportcommentModal';
import { getKeyProfileLoc, updateKeyProfileLoc } from '../../../helpers/profileHelper';
import Badge from '../../../common/components/badges/Badge';


const SubComments = ({ data, subcommentId, updatePost, updatSubComments, index,
    root_id, addNewSubComment, deleteSubComment, postId, isLastIndex, ...rest }) => {

    let props = data;
    const subcomment = rest?.subcomment
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
            setRequiredError({ ...requiredError, updateError: "This field is required" });
        } else {
            setRequiredError({ ...requiredError, updateError: "" });
            updatSubComments(props.comment_id, editedComment, index);
        }
    }



    const sendSubComment = async () => {
        let ref, token, commentData, obj;
        ref = document.querySelector(`#sendSubComment${subcommentId}`);
        if (ref.value.trim() === '')
            return setRequiredError({ ...requiredError, replyError: "This field is required" });

        commentData = {
            confession_id: commentsModalReducer.state?.postId ?? postId,
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
                updateKeyProfileLoc("comments", parseInt(getKeyProfileLoc("comments") ?? 0) + 1)
                addNewSubComment(response.data.comment);
                data = { no_of_comments: commentsModalReducer.state.no_of_comments + 1 }
                updatePost(data)
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

    // Open the modal to report the comment
    const openReportCommModal = () => {
        let confessionId = commentsModalReducer.state?.postId;
        let commentId = props.comment_id;
        dispatch(toggleReportComModal({
            visible: true,
            isReported: props.isReported,
            data: {
                confessionId,
                commentId
            }
        }))
        dispatch(closeCModal())
    }


    return (
        <div className={`postCont overWritePostWithComment subcommentCont ${props.id_path} ${!auth() ? 'notAuth' : ''}`} index={index}>

            {!isLastIndex
                ?
                <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                :
                <div className='overLap'>
                    <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                </div>
            }
            <div className="commentsContHeader">
                <div className="postContHeader">
                    <span className="commentsGotProfileImg">
                        <img src={props.profile_image === "" ? userIcon : props.profile_image} alt="" />
                        {subcomment?.email_verified === 1 ?
                            <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                    </span>

                    {props.curid !== false ?

                        (<Link className={`textDecNone commentsUserName`}
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

                    <Badge classlist='ml-2' points={subcomment?.points} />

                    <span className="postCreatedTime">
                        {/* {props.created_at} */}
                        {DateConverter(props.created_at)}
                    </span>
                </div>

                <div className='editDelComment'>
                    {props.is_editable === 1 ?
                        <>
                            <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                            {commentsModalReducer.updateField.comment_id !== props.comment_id ? <img src={editCommentIcon} className='editCommentIcon' onClick={setComment} /> : ''}
                            {(auth() && props.isReported !== 2) ? <i
                                className="fa fa-exclamation-circle reportComIcon"
                                aria-hidden="true"
                                onClick={openReportCommModal}></i> : null}
                        </> :
                        (auth() && props.isReported !== 2) ? <i
                            className="fa fa-exclamation-circle reportComIcon"
                            aria-hidden="true"
                            onClick={openReportCommModal}></i> : null
                    }
                </div>

            </div>
            <div className="postBody">
                <div className="postedPost mb-0">


                    {/* {isLastIndex ? <div className="mb-3 pb-2 replied_to_cont">
                        <div className="d-flex align-items-center">
                            <i className="fa fa-quote-left pr-1 pb-2" aria-hidden="true"></i>
                            <span className="mb-1 font-italic replied_to_message">pp</span>
                            <i className="fa fa-quote-right pl-1 pb-2" aria-hidden="true"></i>
                        </div>
                        <small>Poisonflower</small>
                    </div> : null} */}

                    {subcomment?.is_edited === 1 ?
                        <i className="fa fa-pencil pr-2" aria-hidden="true"></i> :
                        null}
                    <pre className="preToNormal">
                        {commentsModalReducer.updateField.comment_id !== props.comment_id && props.comment}
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
                                {requiredError.updateError !== "" ? <span className="d-block errorCont text-danger mb-2 moveUp">{requiredError.updateError}</span> : null}
                            </>
                        }
                    </pre>

                    {auth() && <div className="replyCont replyContainer">
                        <span onClick={openCommentBox}>
                            <img src={commentReplyIcon} alt="" className="replyIcon" />
                            <span className='pl-2'>Reply</span>
                        </span>

                        {commentsModalReducer.commentField.comment_id === subcommentId &&
                            <>
                                <div className='inputToAddSubComment textAreaToComment'>
                                    <TextareaAutosize
                                        type="text"
                                        onKeyDown={(e) => checkKeyPressed(e, 1)}
                                        maxLength="2000"
                                        id={`sendSubComment${props.comment_id}`}
                                        placeholder='Write your reply'
                                        className="form-control">
                                    </TextareaAutosize>

                                    <div
                                        className="arrowToAddComment mt-0"
                                        type="button"
                                        onClick={sendSubCommentDebounced}
                                    >
                                        <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                    </div>
                                </div>
                            </>

                        }
                        {requiredError.replyError !== "" ? <span className="d-block errorCont text-danger mb-0 mt-2 moveUp">{requiredError.replyError}</span> : null}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default SubComments