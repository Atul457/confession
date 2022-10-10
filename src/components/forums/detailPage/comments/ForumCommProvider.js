import { apiStatus } from "../../../../helpers/status"

const showSubCommentsFn = (countChild, SLOMT = 3) => {
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

const subComIniVal = {
    status: apiStatus.IDLE,
    data: [],
    message: ""
}

const showSubComValue = {
    present: false,
    show: false,
    isShown: false,
    isBeingExpanded: false
}


const goUp = () => {
    document.querySelector("#postsMainCont").scrollTo({ top: "0px", behavior: "smooth" });
}

const requestedStatus = {
    is_not_requested: 0,
    is_requested: 1,
    approved: 2
}

const forum_types = {
    private: 2,
    public: 1,
    closed: 0
}

const reportedFormStatus = {
    reported: 1
}

const isAllowedToComment = currForum => {
    const isClosed = currForum?.type === forum_types.closed
    const isApproved = currForum?.is_requested === requestedStatus.approved
    const isAllowedType = currForum?.type === forum_types.public
    const allowToComment = !isClosed && (isAllowedType || isApproved)
    return allowToComment
}

export {
    showSubCommentsFn,
    showSubComValue,
    subComIniVal,
    goUp,
    requestedStatus,
    forum_types,
    reportedFormStatus,
    isAllowedToComment
}