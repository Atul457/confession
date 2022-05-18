import React from 'react';
import addFriend from "../../images/addFriend.svg";
import cancelFriend from "../../images/cancelFriendPop.svg";
 

export default function ShareRequestPopUp({ toggleSharekit, isNotFriend, openFrReqModalFn, closeShareMenu }) {

  const do_ = () => {
    openFrReqModalFn();
    closeShareMenu();
  }

  return (
    <div className='shareReqCont'>
      {isNotFriend === 1 && 
      <>
        <div className="shareReqRows" type="button" onClick={do_}>
          <img src={addFriend}/>
          <span>
            Friend Request
          </span>
        </div>
        <div className='shareReqDivider'></div>
      </>
      }

      {isNotFriend === 2 &&
        <>
          <div className="shareReqRows" type="button" onClick={do_}>
          <img src={cancelFriend} className="cancelFriend"/>
            <span>
              Cancel Request
            </span>
          </div>
          <div className='shareReqDivider'></div>
        </>
      }
      <div className="shareReqRows" type="button" onClick={toggleSharekit}>
        <i className="fa fa-share-alt" aria-hidden="true"></i>
        <span>
          Share
        </span>
      </div>
    </div>
  )
}
