export const commentsModActions = {
    OPENMODAL : "OPENCOMMENTSGOTMODAL",
    CLOSEMODAL : "CLOSECOMMENTSGOTMODAL",
    RESET : "RESETCOMMENTSGOTMODAL",
    REOPEN : "REOPENCOMMENTSGOTMODAL",
    UPDATEMODAL : "UPDATECOMMENTSMODAL"
}


export const openCModal = payload => {
    return {
        type: commentsModActions.OPENMODAL,
        payload
    }
}


export const closeCModal = payload => {
    return {
        type : commentsModActions.CLOSEMODAL,
        // payload 
    }
}

export const reOpenCModal = () => {
    return {
        type: commentsModActions.REOPEN,
    }
}

export const resetCModal = () => {
    return {
        type: commentsModActions.RESET,
    }
}

export const updateCModal =  (payload) => {
    return {
        type: commentsModActions.UPDATEMODAL,
        payload
    }
}