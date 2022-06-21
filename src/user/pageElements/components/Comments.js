
import React, { useRef, useState, useEffect } from 'react';
import userIcon from '../../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import forwardIcon from '../../../images/forwardIcon.png';
import editCommentIcon from '../../../images/editCommentIcon.png';
import TextareaAutosize from 'react-textarea-autosize';
import { fetchData } from '../../../commonApi';
import DateConverter from '../../../helpers/DateConverter';
import { useDispatch, useSelector } from 'react-redux';
import { setCommentField } from '../../../redux/actions/commentsModal';


export default function Comments(props) {


    let SLOMT = 3; // SHOW LATEST ON COMMENTS MORE THAN
    const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');
    const [editedComment, setEditedComment] = useState("");
    const [toggleTextarea, setToggleTextarea] = useState(false);
    const [requiredError, setRequiredError] = useState({ updateError: '', replyError: '' });
    const editCommentField = useRef(null);
    const dispatch = useDispatch();
    const [subComments, setSubComments] = useState({ data: [], loading: false })
    const [showSubComments, setShowSubComments] = useState(() => {
        return getShowSubComments()
    })

    useEffect(() => {
        if (toggleTextarea) {
            editCommentField.current.focus();
        }
    }, [toggleTextarea])

    useEffect(() => {
        if (showSubComments.isBeingExpanded === true) {
            console.log("fetch sub comments, now");
            commentsOnCconfession({})
        }
    }, [showSubComments.isBeingExpanded])


    useEffect(() => {
        if (showSubComments.present === true && showSubComments.show === true) {
            commentsOnCconfession({ fetchOnLoad: true })
        }
    }, [])


    const setComment = () => {
        if (requiredError.updateError !== '')
            setRequiredError({ ...requiredError, updateError: "" });
        dispatch(setCommentField({ id: "" }));
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
            setRequiredError({ ...requiredError, updateError: "This is required field" });
        } else {
            setRequiredError({ ...requiredError, updateError: "" });
            props.updateComment(commentData);
            setToggleTextarea(false);
        }

    }


    const sendSubComment = async () => {

        var userData, commentData, ref, obj;

        if (requiredError.replyError !== '')
            setRequiredError({ ...requiredError, replyError: '' });

        preventDoubleClick(true);

        ref = document.querySelector(`#textarea${props.commentId}`);

        if (ref.value.trim() === "") {
            setRequiredError({ ...requiredError, replyError: "This is required field" });
            return preventDoubleClick(false);
        }

        commentData = {
            confession_id: props.postId,
            comment: ref.value,
            parent_id: props.commentId,
            root_id: props.commentId
        }

        ref.value = ""

        if (auth())
            userData = localStorage.getItem("userDetails");

        userData = JSON.parse(userData).token;
        obj = {
            data: commentData,
            token: userData,
            method: "post",
            url: "postcomment"
        }

        try {
            const response = await fetchData(obj)
            if (response.data.status === true) {
                setSubComments({ ...subComments, data: [...subComments.data, response.data.comment] })
                dispatch(setCommentField({ id: "" }));
            } else {
                setRequiredError({ ...requiredError, replyError: response.data.message });
            }
        }
        catch (err) {
            console.log(err);
        }
        preventDoubleClick(false);
    }


    const preventDoubleClick = (runOrNot) => {
        var elem = document.querySelector('#commentsModalDoComment');
        runOrNot === true ? elem.classList.add("ptNull") : elem.classList.remove("ptNull");;
    }



    function getShowSubComments() {
        let countChild = props.countChild;
        if (countChild && countChild > SLOMT)
            return {
                present: true,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }
        else if (countChild && countChild <= SLOMT)
            return {
                present: true,
                show: true,
                isShown: false,
                isBeingExpanded: false
            }
        else if (countChild === 0)
            return {
                present: false,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }
    }


    async function commentsOnCconfession({ page = 1, append = false, fetchOnLoad = false }) {

        // console.log({ page, append, fetchOnLoad });
        // let pageNo = page;
        // let commentId = props.commentId;
        // let token;

        // if (fetchOnLoad === true)
        //     setShowSubComments({ ...showSubComments, isShown: true })

        // setSubComments({ ...subComments, loading: true });

        // if (auth()) {
        //     token = localStorage.getItem("userDetails");
        //     token = JSON.parse(token);
        //     token = token.token;
        // } else {
        //     token = "";
        // }

        // let data = {
        //     "confession_id": props.postId,
        //     "page": pageNo,
        //     "root_id": commentId
        // }

        // let obj = {
        //     data: data,
        //     token: token,
        //     method: "post",
        //     url: "getcomments"
        // }
        // try {
        //     const res = await fetchData(obj)
        //     if (res.data.status === true) {
        //         return setSubComments({ loading: false, data: res.data.body.comments })
        //     } else {
        //         console.log(res);
        //     }
        //     setSubComments({ ...subComments, loading: false })
        // } catch {
        //     setSubComments({ ...subComments, loading: false })
        //     console.log("something went wrong");
        // }
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
                        if (comment === 0) {
                            return updateComment();
                        } else {
                            sendSubComment();
                        }
                    }, 100);
                }
            }
        }
    }


    // DELETES THE COMMENT
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
        <>
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
                        {DateConverter(props.created_at)}
                    </span>

                    {props.is_editable === 1 &&
                        <div className='editDelComment'>
                            <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                            {toggleTextarea === false && <img src={editCommentIcon} className='editCommentIcon' onClick={setComment} />}
                        </div>
                    }

                </div>
                <div className="postBody">
                    <div className="postedPost mb-0">
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
                    </div>
                </div>
            </div>
        </>
    )
}
