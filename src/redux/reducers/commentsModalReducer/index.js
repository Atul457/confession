import { commentsModActions } from "../../actions/commentsModal";

const initialState = {
    visible: false,
    state: null
}


const commentsModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case commentsModActions.OPENMODAL:
            return {
                ...state,
                visible: true,
                state: action.payload
            }

        case commentsModActions.CLOSEMODAL:
            return {
                ...state,
                visible: false,
            }


        case commentsModActions.REOPEN:
            return {
                ...state,
                visible: true,
            }


        case commentsModActions.UPDATEMODAL:
            // console.log({
            //     ...state,
            //     state: {
            //         ...state.state,
            //         isNotFriend: action.payload
            //     }
            // });
            return {
                ...state,
                state: {
                    ...state.state,
                    isNotFriend: action.payload
                }
            }


        case commentsModActions.RESET:
            return initialState

        default:
            return state;
    }
}

export default commentsModalReducer;