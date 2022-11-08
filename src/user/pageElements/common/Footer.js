import React from 'react';
import homeIconActive from '../../../images/homeIcon.svg';
import homeIcon from '../../../images/homeIconM.svg'
import inboxIcon from '../../../images/inboxIconM.png'
import inboxIconActive from '../../../images/inboxIconActive.svg'
import contactUsActiveIcon from '../../../images/contactUsIconActive.svg';
import contactUsIcon from '../../../images/contactUsMobIcon.svg';
import { Link, NavLink, useLocation } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';
import { useSelector } from 'react-redux';
import confessIconActive from '../../../images/confessIconActive.svg'
import confessIcon from '../../../images/confessIconM.svg'


export default function Footer(props) {

    let currentUrl = window.location.href;
    const location = useLocation().pathname
    currentUrl = currentUrl.split("/");
    currentUrl = currentUrl[(currentUrl.length) - 1];
    const notificationReducer = useSelector(store => store.notificationReducer);


    return (
        <footer className="col-12 d-block d-md-none footer">
            <div className="linksCont container-fluid">
                <div className="linkBtns" onClick={props?.refreshFeed}>
                    <Link to="/home" className="linkBtnsAnchor">
                        <span className="headIconCont">
                            <img src={currentUrl === 'home' ? homeIconActive : homeIcon} alt="" />
                        </span>
                        <span className={`footLinkName ${currentUrl === "home" ? "activeLinkOfHeader" : ""}`}>Home</span>

                    </Link>
                </div>

                <div className="linkBtns">
                    <NavLink to="/forums" className="linkBtnsAnchor">
                        <span className="headIconCont">
                            <img src={confessIconActive} alt="confessIconActive" className='active' />
                            <img src={confessIcon} alt="confessIcon" className='inactive' />
                        </span>
                        <span className={`footLinkName ${location.startsWith("/forum") ? "activeLinkOfHeader" :
                            ""}`}>Forums</span>
                    </NavLink>
                </div>

                {auth()
                    ?
                    <div className="linkBtns">
                        <Link to="/chat" className="linkBtnsAnchor chatLink">
                            <span className="headIconCont">
                                <img src={currentUrl === 'chat' ? inboxIconActive : inboxIcon} alt="" />
                            </span>
                            <span className={`footLinkName ${notificationReducer.messagesCount > 0 ? 'newInboxMessages' : ''} ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Chat</span>
                        </Link>
                    </div>
                    :
                    <div className="linkBtns">
                        <Link to="/report" className="linkBtnsAnchor">
                            <span className="headIconCont">
                                <img className="contactUsIcon" src={currentUrl === 'report' ? contactUsActiveIcon : contactUsIcon} alt="" />
                            </span>
                            <span className={`footLinkName ${currentUrl === "report" ? "activeLinkOfHeader" : ""}`}>Contact us</span>
                        </Link>
                    </div>}
            </div>
        </footer>
    )
}
