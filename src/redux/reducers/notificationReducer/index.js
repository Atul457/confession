import { notiActionTypes } from "../../actions/notificationAC";


const initialState = {
    data: {},
    isVisible: false
}


const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case notiActionTypes.OPENPOPUP: return {...state, isVisible : true}
        case notiActionTypes.CLOSEPOPUP: return { ...state, isVisible: false }
        default: return state;
    }
}


export default notificationReducer;