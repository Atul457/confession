import React from 'react';
import homeIconActive from '../../../images/homeIcon.png';
import homeIcon from '../../../images/homeIconM.png'
import confessIcon from '../../../images/confessIconM.png'
import confessIconActive from '../../../images/confessIconActive.png'
import inboxIcon from '../../../images/inboxIconM.png'
import inboxIconActive from '../../../images/inboxIconActive.png'
import contactUsActiveIcon from '../../../images/contactUsIconActive.png';
import contactUsIcon from '../../../images/contactUsMobIcon.png';
import { Link } from "react-router-dom";
import auth from '../../behindScenes/Auth/AuthCheck';

export default function Footer() {

    let currentUrl = window.location.href;
    currentUrl = currentUrl.split("/");
    currentUrl = currentUrl[(currentUrl.length) - 1];


    return (
        <footer className="col-12 d-block d-md-none footer">
            <div className="linksCont container-fluid">
                <div className="linkBtns">
                    <Link to="/home" className="linkBtnsAnchor headerLinks">
                        <span className="headIconCont">
                            <img src={currentUrl === 'home' ? homeIconActive : homeIcon} alt="" />
                        </span>
                        <span className={`footLinkName ${currentUrl === "home" ? "activeLinkOfHeader" : ""}`}>Home</span>

                    </Link>
                </div>
                <div className="linkBtns">
                    <Link to="/createPost" className="linkBtnsAnchor">
                        <span className="headIconCont">
                            <img src={currentUrl === 'createPost' ? confessIconActive : confessIcon} alt="" />
                        </span>
                        <span className={`footLinkName ${currentUrl === "createPost" ? "activeLinkOfHeader" : ""}`}>Confess/Share</span>
                    </Link>
                </div>
                {auth()
                    ?
                    <div className="linkBtns">
                        <Link to="/chat" className="linkBtnsAnchor">
                            <span className="headIconCont">
                                <img src={currentUrl === 'chat' ? inboxIconActive : inboxIcon} alt="" />
                            </span>
                            <span className={`footLinkName ${currentUrl === "chat" ? "activeLinkOfHeader" : ""}`}>Chat</span>
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
