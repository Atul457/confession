import { apiStatus } from "../../../helpers/status";
import { searchAcs } from "../../actions/searchAc/searchAc";

const initialState = {
    status: apiStatus.IDLE,
    message: "",
    data: [],
    type: 0,
    page: 1,
    visible: false,
    hasMore: true,
    searchStr: ""
}


const SearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case searchAcs.SEARCH_ALL: return {
            ...state,
            ...action.payload,
            data: [...(action?.payload?.append ? state.data : action.payload?.data ?? [])]
        };

        default:
            return state
    }
}

export default SearchReducer;