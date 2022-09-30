import React, { useState } from 'react'
import rejectRequest from '../../../images/rejectRequest.svg'
import acceptRequest from '../../../images/acceptRequest.svg'

export default function Requests(props) {

    const [showReq, setShowReq] = useState(true);

    const processReq = (decision, requesterid) => {
        if (decision) {
            setShowReq(false);
            props.updateFriendCount(1, requesterid);
        } else {
            setShowReq(false);
            props.updateFriendCount(2, requesterid);
        }
    }

    return (

        <div className={`requesterDesc boxShadow ${!showReq && "d-none"}`}>
            {showReq &&
                <div className="imgNRequesterDesc d-flex align-items-center">
                    <img src={props.imgUrl} alt="" className="friendRequestsHImgCont" />
                    <div className="infoOfRequesterCont">
                        <div className="requesterName text-capitalize">{props.requesterName}</div>
                        <div className="requesterCountOfSharedConfessions">Shared {props.requestersTotalSharedConf} confessions</div>
                    </div>
                </div>}
            {showReq &&
                <div className="acceptOrReject d-flex">
                    <img src={acceptRequest} onClick={() => processReq(true, props.request_id)} type="button" alt="" className="friendRequestsHeaderImg" />
                    <img src={rejectRequest} onClick={() => processReq(false, props.request_id)} type="button" alt="" className="friendRequestsHeaderImg right" />
                </div>}
        </div>
    )
}
