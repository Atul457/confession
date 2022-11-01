import React, { useState } from 'react';
import rightArrowIcon from '../../../images/rightArrow.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import userIcon from '../../../images/userAcc.png';
import verifiedIcon from '../../../images/verifiedIcon.svg';
import { Friend } from '../../../redux/actions/friendDetails/index';
import Badge from '../../../common/components/badges/Badge';


export default function Friends(props) {
    let history = useNavigate();
    const friend = props?.friend
    const dispatch = useDispatch();
    const [chat] = useState(() => {
        return {
            name: props.chatterName,
            image: props.imgUrl !== "" ? props.imgUrl : userIcon,
            channel_id: props.channel_id,
            friend_id: props.friend_id,
            is_userreport: props.is_userreport
        }
    })

    const setChatToOpen = () => {
        dispatch(Friend(chat));
        history("/chat");
    }

    return (
        <div className={`requesterDesc boxShadow`} onClick={setChatToOpen}>

            <div className="friendsListProfile d-flex align-items-center w-100">
                <span className="friendRequestsHImgCont">
                    <img src={props.imgUrl} alt="" className='friendsProfileImg' />
                    {friend?.email_verified === 1 ?
                        <img src={verifiedIcon} title="Verified user" alt="verified_user_icon" className='verified_user_icon' /> : null}
                </span>
                <div className="infoOfRequesterCont">
                    <div className="requesterName requester_name text-capitalize">
                        <span>{props.chatterName}</span>
                        <Badge points={friend?.points} classlist="ml-2" />
                    </div>
                    <div className="requesterCountOfSharedConfessions">Shared {props.no_of_confessions} confessions</div>

                </div>
                <img src={rightArrowIcon} alt="" className="profileChatArrowImg" type="button" />
            </div>

        </div>
    )
}
