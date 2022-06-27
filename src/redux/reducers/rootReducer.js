import { combineReducers } from 'redux'
import GetFriend from './friendReducer'
import Terms from './termsReducer'
import VerifyEmail from './eVerifyReducer';
import ShareReducer from './shareReducer';
import { updateUserPassReducer } from './updateUserPassReducer';
import { forgotUserPassReducer } from './forgotUpReducer';
import commentsModalReducer from './commentsModalReducer';
import friendReqModalReducer from './friendReqModalReducer';
import postAlertReducer from './postAlertReducer';
import notificationReducer from './notificationReducer';


const rootReducer = combineReducers({
    Terms,
    GetFriend,
    VerifyEmail,
    ShareReducer,
    updateUserPassReducer,
    forgotUserPassReducer,
    commentsModalReducer,
    friendReqModalReducer,
    postAlertReducer,
    notificationReducer
})

export default rootReducer
