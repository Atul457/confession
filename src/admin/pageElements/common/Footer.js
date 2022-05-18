import React from 'react';
import homeIcon from '../../../images/mobileHome.png'
import homeIconActive from '../../../images/homeIconActive.png'
import confessIconActive from '../../../images/confessIconActive.png'
import confessIcon from '../../../images/confessIconMobile.png'
import inboxIcon from '../../../images/inboxIconMobile.png';
import inboxIconActive from '../../../images/inboxIconActive.png';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router';

export default function Footer() {

    // let currentUrl = window.location.href;
    // currentUrl = currentUrl.split("/");
    // currentUrl = currentUrl[(currentUrl.length) - 1];

    let useLocations = useLocation();
    let currentUrl = (useLocations.pathname).replace("/", "");


    return (
        <footer className="col-12 d-block d-md-none footer">
            <div className="linksCont container-fluid">
                <div className="linkBtns">
                    <Link to="/admin/users" className="linkBtnsAnchor headerLinks">

                        <i className={`fa fa-user moveABit adminHeaderIcons ${currentUrl === "admin/users" ? "oColor" : "lablesColor"}`} aria-hidden="true"></i>
                        <span
                            className={`footLinkName ${currentUrl === "admin/users" ? "activeLinkOfHeader" : ""}`}>Users
                        </span>

                    </Link>
                </div>
                <div className="linkBtns">
                    <Link to="/admin/reported" className="linkBtnsAnchor">

                        <i className={`fa fa-flag-o moveABit adminHeaderIcons  ${currentUrl === "admin/reported" ? "oColor" : "lablesColor"}`} aria-hidden="true"></i>
                        <span className={`footLinkName ${currentUrl === "admin/reported" ? "activeLinkOfHeader" :
                            ""}`}>Reported Users</span>

                    </Link>
                </div>
                <div className="linkBtns">
                    <Link to="/admin/complaints" className="linkBtnsAnchor">

                        <i className={`fa fa-align-justify adminHeaderIcons  ${currentUrl === "admin/complaints" ? "oColor" : "lablesColor"}`} aria-hidden="true" style={{fontSize : "15px"}}></i>
                        <span className={`footLinkName ${currentUrl === "admin/complaints" ? "activeLinkOfHeader" : ""}`}>Complaints</span>

                    </Link>
                </div>
            </div>
        </footer>
    )
}
