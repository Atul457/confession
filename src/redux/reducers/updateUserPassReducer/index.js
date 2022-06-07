import UpdateUPassActions from "../../actions/updateUserPassword";


const statuses = {
    LOADING: "LOADING",
    ERROR: "ERROR",
    STOP: "STOP"
}

const initialState = {
    status: statuses.STOP,
    modal: {
        isOpen: false
    },
    message: ''
}


export const updateUserPassReducer = (state = initialState, action) => {
    switch (action.type) {
        case UpdateUPassActions.OPENMODAL:
            return {
                ...state,
                modal: {
                    isOpen: true
                }
            }

        case UpdateUPassActions.CLOSEMODAL:
            return initialState

        case UpdateUPassActions.CHANGESTATUS:
            return {
                ...state,
                status: action.payload,
                message: ''
            }

        case UpdateUPassActions.UPDATEERROR:
            return {
                ...state,
                message: action.payload,
                status: statuses.STOP
            }

        default: return state
    }
}


export default statuses;
