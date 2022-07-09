import React, { useState, useEffect } from 'react';
import userIcon from '../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../behindScenes/Auth/AuthCheck';
import { useLocation, useNavigate } from 'react-router';
import commentReplyIcon from '../../images/creplyIcon.svg';
import { fetchData } from '../../commonApi';
import DateConverter from '../../helpers/DateConverter';
import { useSelector, useDispatch } from 'react-redux';
import { setCommentField, setUpdateFieldCModal, updateCModalState } from '../../redux/actions/commentsModal';
import TextareaAutosize from 'react-textarea-autosize';
import forwardIcon from '../../images/forwardIcon.svg';
import _ from 'lodash';
import { getAdminToken } from '../../helpers/getToken';
import SubComments from './SubComments';



export default function Comments(props) {


    let SLOMT = 3; // SHOW LATEST ON COMMENTS MORE THAN
    const dispatch = useDispatch();
    const [requiredError, setRequiredError] = useState({ updateError: '', replyError: '' });
    const commentsModalReducer = useSelector(state => state.commentsModalReducer);
    const [subComments, setSubComments] = useState({ data: [], loading: false })
    const [showSubComments, setShowSubComments] = useState(() => {
        return getShowSubComments()
    })
    const history = useNavigate();
    const location = useLocation().pathname;

    useEffect(() => {
        if (getAdminToken() === '') {
            history("talkplacePanel");
        }
    }, [])


    // ON CLICKING THE DIV TO EXPAND THE SUB COMMENTS THIS WORKS
    useEffect(() => {
        if (showSubComments.isBeingExpanded === true) {
            commentsOnCconfession({})
        }
    }, [showSubComments.isBeingExpanded])


    useEffect(() => {
        if (showSubComments.present === true && showSubComments.show === true) {
            commentsOnCconfession({ fetchOnLoad: true })
        }
    }, [])


    function getShowSubComments() {
        let countChild = props.countChild;
        if (countChild && countChild > SLOMT)
            return {
                present: true,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }
        if (countChild && countChild <= SLOMT)
            return {
                present: true,
                show: true,
                isShown: false,
                isBeingExpanded: false
            }
        if (countChild === 0)
            return {
                present: false,
                show: false,
                isShown: false,
                isBeingExpanded: false
            }

        return {
            present: false,
            show: false,
            isShown: false,
            isBeingExpanded: false
        }
    }


    const deleteCommentFunc = async () => {
        let confessionId = props.postId;
        let commentId = props.comment_id;

        let obj = {
            data: {},
            token: getAdminToken(),
            method: "get",
            url: `admin/deletecomment/${confessionId}/${commentId}`,
        }

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                props.changeListener();
                props.updateComments(commentId);
            }
        } catch (error) {
            console.log(error);
        }

    }


    // APPENDS THE NEW COMMENT TO THE SUBCOMMENTS LIST
    const addNewSubComment = (newSubComment) => {
        setSubComments({ ...subComments, data: [...subComments.data, newSubComment] })
    }



    // DELETES THE ELEMENTS FROM SUBCOMMENTS ARR
    const deleteSubComment = (arrayOfNodesIndexes) => {
        let originalArray = [], delCommentCount, data;
        originalArray.push(...subComments.data);
        arrayOfNodesIndexes.forEach(curr => { originalArray.splice(curr, 1) });
        delCommentCount = arrayOfNodesIndexes.length;
        setSubComments({ ...subComments, data: [...originalArray] });

        // UPDATES THE COMMENTSGOTMODAL COMMENT COUNT
        data = { no_of_comments: parseInt(commentsModalReducer.state.no_of_comments) - delCommentCount };
        dispatch(updateCModalState(data));
    }


    // CALLS HANDLESUBCOMMENT TO POST AND ADD A NEW COMMENT
    const updatSubComments = (comment_id, editedComment, index) => {
        sendSubComment(comment_id, editedComment, index)
    }


    const handleSubComment = async (comment_id = false, editedComment = "", index) => {

        var commentData, ref, obj, token, _comment;
        //NEW COMMENT
        if (requiredError.replyError !== '')
            setRequiredError({ ...requiredError, replyError: '' });

        ref = document.querySelector(`#textarea${props.commentId}`);

        if (ref.value.trim() === "") {
            return setRequiredError({ ...requiredError, replyError: "This is required field" });
        }
        _comment = ref.value;

        commentData = {
            confession_id: props.postId,
            comment: _comment,
            parent_id: props.commentId,
            root_id: props.commentId,
            is_admin: 1
        }

        token = getAdminToken();

        obj = {
            data: commentData,
            token: token,
            method: "post",
            url: "postcomment"
        }

        try {

            const response = await fetchData(obj);
            props.updateSingleCommentData({ countChild: props.countChild + 1 }, props.index);
            if (response.data.status === true) {

                // NEW SUB COMMENT
                let data;
                ref.value = ""
                data = { no_of_comments: commentsModalReducer.state.no_of_comments + 1 };
                dispatch(updateCModalState(data))
                dispatch(setCommentField({ id: "" }));

                if (showSubComments.isBeingExpanded === true || showSubComments?.keepOpened === true || subComments.data.length < SLOMT) {
                    setShowSubComments({ ...showSubComments, keepOpened: true });
                    return setSubComments({ ...subComments, data: [...subComments.data, response.data.comment] })
                }

            } else {
                setRequiredError({ ...requiredError, replyError: response.data.message });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const sendSubComment = _.debounce(handleSubComment, 500);


    async function commentsOnCconfession({ page = 1, append = false, fetchOnLoad = false }) {

        let pageNo = page;
        let commentId = props.commentId;
        let token;

        if (fetchOnLoad === true)
            setShowSubComments({ ...showSubComments, isShown: true })

        setSubComments({ ...subComments, loading: true });

        token = '';

        let data = {
            "confession_id": props.postId,
            "page": pageNo,
            "root_id": commentId
        }


        let obj = {
            data: data,
            token: token,
            method: "post",
            url: "getcomments"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                return setSubComments({ loading: false, data: res.data.body.comments })
            } else {
                console.log(res);
            }
            setSubComments({ ...subComments, loading: false })
        } catch (err) {
            setSubComments({ ...subComments, loading: false })
            console.log(err);
        }
    }


    // SUBMITS THE DATA ON ENTER AND CREATES A NEW PARA ON SHIFT+ENTER KEY
    const checkKeyPressed = (event, comment) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                sendSubComment();
            }
        }
    }


    // Handles comment box
    const handleCommentBox = () => {

        if (requiredError.replyError !== '')
            setRequiredError({ ...requiredError, replyError: "" });

        if (commentsModalReducer.updateField.comment_id === props.commentId)
            dispatch(setUpdateFieldCModal({ comment_id: "" }));

        if (props.commentId === commentsModalReducer.commentField.comment_id) {
            return dispatch(setCommentField({ id: "" }));
        }

        dispatch(setCommentField({ id: props.commentId }));
    }


    const openSubComments = () => {
        setShowSubComments({ ...showSubComments, isBeingExpanded: true, isShown: true })
    }


    return (
        <div className={`overWritePostWithCommentWr`}>
            {!props.isLastIndex
                ?
                <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                :
                <div className='overLap'>
                    <i className="fa fa-arrow-circle-o-right connector" aria-hidden="true"></i>
                </div>
            }
            <div className="postCont overWritePostWithComment outer">
                <div className="postContHeader justifyContentInitial">
                    <span className="commentsGotProfileImg">
                        <img src={props.imgUrl === "" ? userIcon : props.imgUrl} alt="" />
                    </span>

                    {props.curid !== false ?

                        (<Link className={`textDecNone`}
                            to={props.curid ? location : `/userProfile/${props.curid}`}>
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

                    <div className='editDelComment'>
                        <i className="fa fa-trash deleteCommentIcon" type="button" aria-hidden="true" onClick={deleteCommentFunc}></i>
                    </div>

                </div>
                <div className="postBody">
                    <div className="postedPost">
                        <pre className="preToNormal">
                            {props.postedComment}
                        </pre>

                        {/* REPLY AREA */}
                        <div className="replyCont">
                            <span onClick={() => handleCommentBox()}>
                                <img src={commentReplyIcon} alt="" className='replyIcon' />
                                <span className='pl-2'>Reply</span>
                            </span>

                            {commentsModalReducer.commentField.comment_id === props.commentId &&
                                <>
                                    <div className='inputToAddSubComment textAreaToComment mt-md-2'>
                                        <TextareaAutosize
                                            type="text"
                                            maxLength="2000"
                                            id={"textarea" + props.commentId}
                                            placeholder='Sub comment'
                                            onKeyDown={(e) => checkKeyPressed(e, 1)}
                                            className="form-control mt-0">
                                        </TextareaAutosize>

                                        <div
                                            className="arrowToAddComment mt-0"
                                            type="button"
                                            onClick={() => handleSubComment()}
                                        >
                                            <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                        </div>
                                    </div>
                                    {requiredError.replyError !== "" ? <span className="d-block errorCont text-danger mb-2 mt-2 moveUp">{requiredError.replyError}</span> : null}
                                </>
                            }
                        </div>
                        {/* REPLY AREA */}
                    </div>
                </div>
            </div>


            {/* IF SUB_COMMENTS PRESENT THEN EXECUTE THE NEXT CONDITION,
            IF THEY ARE NOT SHOW THEN SHOW THE LATEST COMMENT,
            ELSE SHOW ALL THE COMMENTS */}

            {showSubComments.present &&
                showSubComments.isShown === false ?
                <div className="postCont overWritePostWithComment subcommentCont upperView" onClick={openSubComments}>
                    <div className="postContHeader commentsContHeader">
                        <span className="commentsGotProfileImg">
                            <img src={props.imgUrl === "" ? userIcon : props.imgUrl} alt="" />
                        </span>
                        <span className="userName">
                            Dummy name
                        </span>
                        <span className="postCreatedTime">
                            {DateConverter(props.created_at)}
                        </span>
                        <span className='subCommentsCount'>
                            {props.countChild} More Reply
                        </span>
                    </div>
                </div>
                :
                subComments.loading === true ?
                    <div className="w-100 text-center mb-3">
                        <div className="spinner-border pColor" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> :

                    <div className='subcommentsMainContWrapper'>
                        <div className="subcommentsMainCont">
                            {subComments.data.map((subcomment, index) => {
                                return <SubComments
                                    isLastIndex={subComments.data.length === index + 1}
                                    deleteSubComment={deleteSubComment}
                                    addNewSubComment={addNewSubComment}
                                    index={index}
                                    postId={props.postId}
                                    root_id={props.commentId}
                                    key={subcomment.comment_id}
                                    data={subcomment}
                                    updatSubComments={updatSubComments}
                                    subcommentId={subcomment.comment_id} />
                            })}
                        </div>
                    </div>}



        </div>
    )
}
