import React from 'react'
import messageIcon from '../../../images/messageIcon.png'
import requestsIcon from '../../../images/requestsIcon.png'

export default function AddNew(props) {
    return (
        <div className="requesterDesc boxShadow">
            <div className="imgNRequesterDesc d-flex align-items-center">
                <img src={props.imgUrl} alt="" />
                <div className="infoOfRequesterCont">
                    <div className="requesterName">{props.requesterName}</div>
                    <div className="requesterCountOfSharedConfessions">Shared {props.requestersTotalSharedConf} confessions</div>
                </div>
            </div>
            <div className="acceptOrReject d-flex">
                <img src={messageIcon} alt="" className="friendRequestsHeaderImg" />
                <img src={requestsIcon} alt="" className="friendRequestsHeaderImg" />
            </div>
        </div>
    )
}
