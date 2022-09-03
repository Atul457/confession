import { apiStatus } from "../../../helpers/status";
import { shareWithLoveActions } from "../../actions/shareWithLoveAc/shareWithLoveAc";


// INITIAL STATE
const initialState = {
    visible: false,
    staus: apiStatus.IDLE,
    message: ""
};

const shareWithLoveReducer = (state = initialState, action) => {
    switch (action.type) {
        case shareWithLoveActions.TOGGLE_SHARE_WITH_LOVE_MODAL: return {
            ...state,
            ...action.payload
        };
        case shareWithLoveActions.RESET_SHARE_WITH_LOVE_MODAL: return initialState
        default: return state;
    }
}

export default shareWithLoveReducer;