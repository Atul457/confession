import { postAlertActions } from "../../actions/postAlert";


const initialState = {
    visible: false,
    postAnyway: false
}

const postAlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case postAlertActions.OPENMODAL:
            return { ...state, visible: true };
        case postAlertActions.CLOSEMODAL:
            return initialState;
        case postAlertActions.UPDATEMODAL:
            return { ...state, postAnyway: action.payload };
        default:
            return initialState;
    }
}

export default postAlertReducer;