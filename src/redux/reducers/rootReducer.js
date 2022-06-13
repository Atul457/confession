import { combineReducers } from 'redux'
import GetFriend from './friendReducer'
import Terms from './termsReducer'
import VerifyEmail from './eVerifyReducer';
import ShareReducer from './shareReducer';
import { updateUserPassReducer } from './updateUserPassReducer';
import { forgotUserPassReducer } from './forgotUpReducer';
import commentsModalReducer from './commentsModalReducer';
import friendReqModalReducer from './friendReqModalReducer';

const rootReducer = combineReducers({
    Terms,
    GetFriend,
    VerifyEmail,
    ShareReducer,
    updateUserPassReducer,
    forgotUserPassReducer,
    commentsModalReducer,
    friendReqModalReducer
})

export default rootReducer
