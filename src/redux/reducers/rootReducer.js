import { combineReducers } from 'redux'
import GetFriend from './friendReducer'
import Terms from './termsReducer'
// import Confesssions from "./confessionReducer";
// ShareReducer
import VerifyEmail from './eVerifyReducer';
import ShareReducer from './shareReducer';

const rootReducer = combineReducers({
    Terms,
    GetFriend,
    VerifyEmail,
    ShareReducer   
})

export default rootReducer
