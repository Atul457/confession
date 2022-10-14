import React, { useRef } from 'react'

// Third party
import TextareaAutosize from 'react-textarea-autosize';

// Image imports
import forwardIcon from '../../../images/forwardIcon.svg'

// HelperComps
import { ShowResComponent } from '../../HelperComponents';

// Helpers
import { apiStatus } from '../../../helpers/status';
import auth from '../../../user/behindScenes/Auth/AuthCheck';


const CommentBox = props => {

    // Hooks and vars
    const {
        doComment,
        postCommentReducer: { message = "", status, usedById: messageId },
        usedById,
        isForUpdateCom = false,
        usersToTag = [],
        getUsersToTag = () => { }
    } = props,
        maxChar = 2000,
        textboxref = useRef(null),
        isError = status === apiStatus.REJECTED

    const showMessage = usedById === messageId

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

    const tagUser = (nameOfUser) => {
        let value = textboxref?.current.value
        let currSentence = value
        value = value.split("@")
        value = value[value.length - 1]
        console.log(textboxref?.current.value.length)
        console.log(value)
        currSentence = currSentence.replace(value, nameOfUser)
        // textboxref?.current.value = textboxref?.current.value.replace(`'@'`)
        console.log(nameOfUser, currSentence)
    }

    return (
        <>
            {auth &&
                (
                    <>
                        <div className="container-fluid inputWithForwardCont">
                            <div className="textAreaToComment w-100">
                                <TextareaAutosize
                                    type="text"
                                    maxLength={maxChar}
                                    row='1'
                                    ref={textboxref}
                                    onChange={(e) => getUsersToTag(e.target.value)}
                                    onKeyDown={checkKeyPressed}
                                    className="form-control">
                                </TextareaAutosize>
                                {console.log(usersToTag)}
                                {usersToTag?.length ?
                                    <div className='users_to_tag_cont'>
                                        {usersToTag.map(user => {
                                            return <div
                                                onClick={() => tagUser(user?.name)}
                                                className='user_to_tag'>
                                                {user?.name}
                                            </div>
                                        })}
                                    </div>
                                    : null}
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