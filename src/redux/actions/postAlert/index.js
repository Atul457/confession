export const postAlertActions = {
    OPENMODAL: "OPENPOSTALERTMODAL",
    CLOSEMODAL: "CLOSEPOSTALERTMODAL",
    UPDATEMODAL : "UPDATEPSOTALERTMODAL"
}

const openPAlertModal = () => {
    return {
        type: postAlertActions.OPENMODAL,
    }
}

const updatePAlertModal = (newState) => {
    return {
        type: postAlertActions.UPDATEMODAL,
        payload: newState
    }
}

const closePAlertModal = () => {
    return {
        type: postAlertActions.CLOSEMODAL
    }
}

const postAlertActionCreators = {
    openModal: openPAlertModal,
    closeModal: closePAlertModal,
    updateModal: updatePAlertModal
}

export default postAlertActionCreators;