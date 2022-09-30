import React, { useState } from 'react';
import rightArrowIcon from '../../../images/rightArrow.png';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router';
import userIcon from '../../../images/userAcc.png';
import { Friend } from '../../../redux/actions/friendDetails/index';


export default function Friends(props) {
    let history = useNavigate();
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
                    <img src={props.imgUrl} alt="" className='friendsProfileImg'/>
                </span>
                <div className="infoOfRequesterCont">
                    <div className="requesterName text-capitalize">{props.chatterName}</div>
                    <div className="requesterCountOfSharedConfessions">Shared {props.no_of_confessions} confessions</div>

                </div>
                <img src={rightArrowIcon} alt="" className="profileChatArrowImg" type="button" />
            </div>

        </div>
    )
}
