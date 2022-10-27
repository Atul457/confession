import React, { useEffect, useRef } from 'react'

// Third party
// import TextareaAutosize from 'react-textarea-autosize';

// Image imports
import forwardIcon from '../../../images/forwardIcon.svg'

// HelperComps
import { ShowResComponent } from '../../HelperComponents';

// Helpers
import { apiStatus } from '../../../helpers/status';
import auth from '../../../user/behindScenes/Auth/AuthCheck';
import { usersToTagAcFn } from '../../../redux/actions/forumsAc/forumsAc';


const CommentBox = props => {

    // Hooks and vars
    const {
        doComment,
        postCommentReducer: { message = "", status, usedById: messageId },
        usedById,
        isCalledByParent = false,
        toSearch,
        isForUpdateCom = false,
        dispatch,
        usersToTag = {},
        getUsersToTag = () => { }
    } = props,
        // maxChar = 2000,
        textboxref = useRef(null),
        isError = status === apiStatus.REJECTED

    const showMessage = usedById === messageId
    // If both will be undefined and isCalledByParent is same then it means its called by parent
    // else by child
    const showDropDown = (props?.commentBoxId === messageId && isCalledByParent === usersToTag?.isCalledByParent) || (isCalledByParent === usersToTag?.isCalledByParent && props?.commentBoxId === undefined)

    // Functions
    const sendComment = () => {
        doComment(textboxref?.current, isForUpdateCom)
    }


    // Submits the data on enter and creates a new para on shift+enter key
    const checkKeyPressed = (event) => {
        if (window.innerWidth > 767) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                doComment(textboxref?.current, isForUpdateCom)
            }
        }
    }

    const tagUser = (user) => {
        let actualStr = textboxref?.current.innerHTML;
        let newStr = "";
        let regex = new RegExp("@(" + toSearch + "|" + `${toSearch}</div>` + ")$", "i");
        newStr = actualStr.replace(
            regex,
            `<span class="tagged_user dr99${user?.user_id?.trim()}" contenteditable="false">@${user?.name?.trim()}</span>&nbsp;`
        );
        textboxref.current.innerHTML = newStr;
        dispatch(usersToTagAcFn({
            data: [],
            status: apiStatus.IDLE,
            toSearch: ""
        }))
    }

    useEffect(() => {
        const listener = (e) => {
            checkKeyPressed(e)
        }
        const changeListener = (e) => {
            getUsersToTag(e.target.innerText)
        }
        textboxref?.current?.addEventListener("keydown", listener)
        textboxref?.current?.addEventListener("keyup", changeListener)

        return () => {
            textboxref?.current?.removeEventListener("keydown", listener)
            textboxref?.current?.removeEventListener("keyup", changeListener)
        }
    }, [])


    return (
        <>
            {auth &&
                (
                    <>
                        <div className="container-fluid inputWithForwardCont">
                            <div className="textAreaToComment w-100">
                                <div
                                    contentEditable="true"
                                    suppressContentEditableWarning={true}
                                    ref={textboxref}
                                    className="form-control usersBox"
                                    placeholder="Write the sentence you want to.."
                                ></div>
                                {showDropDown && usersToTag?.data?.length ?
                                    <div className='users_to_tag_cont cursor_pointer'>
                                        {usersToTag?.data.map((user, index) => {
                                            return <div
                                                key={user?.user_id + `${index}`}
                                                onClick={() => tagUser(user)}
                                                className='user_to_tag'>
                                                {user?.name}
                                            </div>
                                        })}
                                    </div> : null}
                            </div>
                            <div className="arrowToAddComment" id="userPostCommentIcon" type="button" onClick={sendComment}>
                                <img src={forwardIcon} alt="" className="forwardIconContImg" />
                            </div>
                        </div>
                        {showMessage && message && message !== "" &&
                            <ShowResComponent
                                isError={isError}
                                message={message}
                            />}
                    </>
                )
            }
        </>
    )
}

export default CommentBox