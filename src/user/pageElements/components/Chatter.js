import React from 'react'
import DateConverter from '../../../helpers/DateConverter';


export default function Chatter(props) {

    const openChat = () => {
        props.openChat({
            friend_id: props.friend_id,
            name: props.chatterName,
            image: props.imgUrl,
            channel_id: props.channel_id,
            is_userreport: props.is_userreport,
            index: props.chatIndex
        });
    }

    const unFriend = () => { if (props.friend_id) props.openUnFriendModal(props.channel_id, props.index) }

    return (
        <div className={`singleChatCont ${props.activeChat ? "openedChat" : ""}`} type="button">
            <div className="imgNopenUserNameWrap">
                <span className="userImageContChatCont" onClick={openChat}>
                    <img src={props.imgUrl} alt="" className="userImageContChat" />
                </span>
                <div className="singleChatterUserName">
                    <div className='wrapper_upperCont'>
                        <div className="upperCont" onClick={openChat}>
                            <span className="text-capitalize">
                                {props.chatterName}
                            </span>
                        </div>
                        <i className="fa fa-ellipsis-v showChatArrCont" aria-hidden="true" onClick={unFriend}></i>
                    </div>
                    <div className="lastMessageNtimeWrapper chatter_footer" onClick={openChat}>
                        <div className="chatterUserDesc">
                            {props.chatterDesc}
                        </div>
                        <span className="timeStamp">
                            {DateConverter(props.updated_at)}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}
