import React from 'react'
import DateConverter from '../../../helpers/DateConverter';



export default function Chatter(props) {


    // console.log(props.chatterDetails);
    const openChat = (chatDetails) => {
        props.openChat(chatDetails);
    }

    return (
        <div className={`singleChatCont ${props.activeChat ? "openedChat" : ""}`} type="button" onClick={(e) => {
            openChat({
                friend_id: props.friend_id,
                name: props.chatterName,
                image: props.imgUrl,
                channel_id: props.channel_id,
                is_userreport: props.is_userreport,
                index: props.chatIndex
            })
        }}>
            <div className="imgNopenUserNameWrap">
                <span className="userImageContChatCont">
                    <img src={props.imgUrl} alt="" className="userImageContChat" />
                </span>
                <div className="singleChatterUserName">
                    <span className="text-capitalize">
                        {props.chatterName}
                        {/* {
                            props.is_online === 1 ?
                            <span className="status">Online</span> : 
                            <span className="status offlineColor">Offline</span>
                        } */}

                    </span>
                    <div className="lastMessageNtimeWrapper">
                        <div className="chatterUserDesc">
                            {props.chatterDesc}
                        </div>
                    </div>
                </div>

                <span className="timeStamp">
                    {/* {props.updated_at} */}
                    {DateConverter(props.updated_at)}
                    {/* 04:52 AM */}
                </span>
            </div>
            {/* <img src={rightArrowIcon} alt="" className="showChatArrCont" /> */}
        </div>
    )
}
