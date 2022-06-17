export const postAlertActions = {
    OPENMODAL: "OPENPOSTALERTMODAL",
    CLOSEMODAL: "CLOSEPOSTALERTMODAL"
}

const openPAlertModal = (newState) => {
    return {
        type: postAlertActions.OPENMODAL,
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
    closeModal: closePAlertModal
}

export default postAlertActionCreators;