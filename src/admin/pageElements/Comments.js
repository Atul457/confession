import React, { useState, useEffect } from 'react';
import userIcon from '../../images/userAcc.png';
import { Link } from "react-router-dom";
import auth from '../behindScenes/Auth/AuthCheck';
import { useLocation, useNavigate, useParams } from 'react-router';
import { fetchData } from '../../commonApi';
import DateConverter from '../../helpers/DateConverter';


export default function Comments(props) {
    const [adminDetails] = useState(auth() ? JSON.parse(localStorage.getItem("adminDetails")) : '');
    const [deleteComment, setDeleteComment] = useState(false);
    const history = useNavigate();
    const location = useLocation().pathname;

    useEffect(() => {
        if (adminDetails.token === '') {
            history("talkplacePanel");
        }
    }, [])


    const deleteCommentFunc = async () => {
        let confessionId = props.postId;
        let commentId = props.comment_id;

        let obj = {
            data: {},
            token: adminDetails.token,
            method: "get",
            url: `admin/deletecomment/${confessionId}/${commentId}`,
        }

        try {
            setDeleteComment(true);
            const res = await fetchData(obj)
            if (res.data.status === true) {
                props.changeListener();
                props.updateComments(commentId);
            }
            setDeleteComment(false);
        } catch (error) {
            console.log(error);
            setDeleteComment(false);
        }

    }


    return (
        <div className="postCont overWritePostWithComment">
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
                    {/* {props.created_at} */}
                    {DateConverter(props.created_at)}
                </span>

                <span type="button" className="categoryOfUser deleteCategory" onClick={deleteCommentFunc}>
                    {deleteComment === true
                        ?
                        <div className="spinnerSizePost spinner-border text-white" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        "Delete"}
                </span>

            </div>
            <div className="postBody">
                <div className="postedPost">
                    <pre className="preToNormal">
                        {props.postedComment}
                    </pre>
                </div>
            </div>
        </div>
    )
}
