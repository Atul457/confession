import { postAlertActions } from "../../actions/postAlert";


const initialState = {
    visible: false,
    postAnyway: false
}

const postAlertReducer = (state = initialState, action) => {
    switch (action.type) {
        case postAlertActions.OPENMODAL:
            return { ...state, ...action.payload };
        case postAlertActions.CLOSEMODAL:
            return initialState;
        default:
            return initialState;
    }
}

export default postAlertReducer;