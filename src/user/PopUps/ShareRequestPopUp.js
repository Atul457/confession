import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addFriend from "../../images/addFriend.svg";
import cancelFriend from "../../images/cancelFriendPop.svg";



export default function ShareRequestPopUp({ toggleSharekit, isNotFriend, openFrReqModalFn, closeShareMenu }) {

  var classToAdd = '';
  var moveABitUp = '';
  const commentsModalReducer = useSelector(state => state.commentsModalReducer)

  const do_ = () => {
    openFrReqModalFn();
    closeShareMenu();
  }

  if (isNotFriend !== 1 && isNotFriend !== 2) {
    classToAdd = 'available'
  }

  if (isNotFriend === 1 || isNotFriend === 2) {
    moveABitUp = 'moveABitUp'
  }

  return (
    <div className={`shareReqCont ${moveABitUp}`}>
      {isNotFriend === 1 &&
        <>
          <div className="shareReqRows user" type="button" onClick={do_}>
            <img src={addFriend} />
            <span>
              Friend Request
            </span>
          </div>
          <div className='shareReqDivider'></div>
        </>
      }

      {isNotFriend === 2 &&
        <>
          <div className="shareReqRows user" type="button" onClick={do_}>
            <img src={cancelFriend} className="cancelFriend" />
            <span>
              Cancel Request
            </span>
          </div>
          <div className='shareReqDivider'></div>
        </>
      }
      <div className={`shareReqRows ${classToAdd} user w-100`} type="button" onClick={toggleSharekit}>
        <i className="fa fa-share-alt dontHide" aria-hidden="true"></i>
        <span className='dontHide'>
          Share
        </span>
      </div>
    </div>
  )
}
