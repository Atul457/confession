import { postBoxStateAcTypes } from "../../actions/postBoxState";


// INITIAL STATE
const initialState = { selectedCat: '', description: '' };

const postBoxStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case postBoxStateAcTypes.SET: return { ...state, ...action.payload };
        default: return initialState;
    }
}

export default postBoxStateReducer;