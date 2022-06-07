import statuses from "../../reducers/updateUserPassReducer"


const UpdateUPassActions = {
    OPENMODAL: 'OPENMODAL',
    CLOSEMODAL: 'CLOSEMODAL',
    CHANGESTATUS: 'CHANGESTATUS',
    UPDATEERROR: 'UPDATEERROR'
}


const openChangePassModal = () => {
    return {
        type: UpdateUPassActions.OPENMODAL
    }
}

const closeChangePassModal = () => {
    return {
        type: UpdateUPassActions.CLOSEMODAL
    }
}

const changeStatusUPassModal = (payload = statuses.STOP) => {
    return {
        type: UpdateUPassActions.CHANGESTATUS,
        payload
    }
}

const updateErrorUpassModal = (payload) => {
    return {
        type: UpdateUPassActions.UPDATEERROR,
        payload
    }
}


export const UpdateUPassActionCreators = {
    openChangePassModal,
    closeChangePassModal,
    changeStatusUPassModal,
    updateErrorUpassModal
}



export default UpdateUPassActions