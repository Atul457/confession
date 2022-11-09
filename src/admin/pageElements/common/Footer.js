import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { useLocation } from 'react-router';
import forumsAdminIcon from '../../../images/forumsAdminIconMob.svg'
import forumsAdminIconActive from '../../../images/forumsAdminIconMobActive.svg';

export default function Footer() {

    let useLocations = useLocation();
    let currentUrl = (useLocations.pathname).replace("/", "");
    const isReportedItemActive = currentUrl === "admin/reportedposts" || currentUrl === "admin/reported" || currentUrl === "admin/reportedComments"


    return (
        <footer className="col-12 d-block d-md-none footer admin">
            <div className="linksCont container-fluid pt-2">
                <div className="linkBtns">
                    <NavLink to="/admin/users" className="linkBtnsAnchor headerLinks">
                        <i className={`fa fa-user moveABit adminHeaderIcons ${currentUrl === "admin/users" ? "oColor" : "text-white"}`} aria-hidden="true"></i>
                        <span
                            className={`footLinkName ${currentUrl === "admin/users" ? "activeLinkOfHeader" : ""}`}>Users
                        </span>
                    </NavLink>
                </div>

                <div className="linkBtns dropdownLink">
                    <div className="linkBtnsAnchor headerLinks">
                        <span className="footerIconCont">
                            <img src={!currentUrl.includes("forum") ? forumsAdminIcon : forumsAdminIconActive} alt="" />
                        </span>
                        <span
                            className={`headLinkName footLinkName ${(currentUrl.includes("forum")) ? "activeLinkOfHeader" : ""}`}>Forums</span>
                        <div className="reportItems">
                            <div className="reportItem">
                                <NavLink to="/admin/forums" className="headerNavLinks">
                                    <i className={`fa fa-circle-o-notch moveABit adminHeaderIcons  ${currentUrl === "/admin/forums" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span
                                        className={`headLinkName ${currentUrl === "/admin/forums" ? "activeLinkOfHeader" : ""}`}>All Forums</span>
                                </NavLink>
                            </div>
                            <div className="reportItem">
                                <NavLink to="/admin/reported_forums" className="headerNavLinks">
                                    <i className={`fa fa-exclamation-triangle moveABit adminHeaderIcons  ${currentUrl === "/forums/reported_forums" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span
                                        className={`headLinkName ${currentUrl === "/forums/reported_forums" ? "activeLinkOfHeader" : ""}`}>Reported Forums</span>
                                </NavLink>
                            </div>
                            <div className="reportItem">
                                <NavLink to="/admin/reported_forum_comments" className="headerNavLinks">
                                    <i className={`fa fa-file moveABit adminHeaderIcons  ${currentUrl === "admin/reported_forum_comments" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span className={`headLinkName ${currentUrl === "admin/reported_forum_comments" ? "activeLinkOfHeader" :
                                        ""}`}>Reported comments</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="linkBtns dropdownLink">
                    <div className="linkBtnsAnchor headerLinks">
                        <i className={`fa fa-exclamation-triangle moveABit adminHeaderIcons ${isReportedItemActive ? "oColor" : "text-white"}`} aria-hidden="true"></i>
                        <span
                            className={`footLinkName ${isReportedItemActive ? "activeLinkOfHeader" : ""}`}>Reports
                        </span>

                        <div className="reportItems">
                            <div className="reportItem">
                                <NavLink to="/admin/reportedposts" className="headerNavLinks">
                                    <i className={`fa fa-exclamation-triangle moveABit adminHeaderIcons  ${currentUrl === "admin/reportedposts" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span
                                        className={`headLinkName ${currentUrl === "admin/reportedposts" ? "activeLinkOfHeader" : ""}`}>Reported posts</span>
                                </NavLink>
                            </div>
                            <div className="reportItem">
                                <NavLink to="/admin/reported" className="headerNavLinks">
                                    <i className={`fa fa-flag-o moveABit adminHeaderIcons  ${currentUrl === "admin/reported" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span className={`headLinkName ${currentUrl === "admin/reported" ? "activeLinkOfHeader" :
                                        ""}`}>Reported Users</span>
                                </NavLink>
                            </div>
                            <div className="reportItem">
                                <NavLink to="/admin/reportedComments" className="headerNavLinks">
                                    <i className={`fa fa-file moveABit adminHeaderIcons  ${currentUrl === "admin/reportedComments" ? "oColor" : ""}`} aria-hidden="true"></i>
                                    <span className={`headLinkName ${currentUrl === "admin/reportedComments" ? "activeLinkOfHeader" :
                                        ""}`}>Reported Comments</span>
                                </NavLink>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="linkBtns">
                    <Link to="/admin/complaints" className="linkBtnsAnchor">
                        <i className={`fa fa-align-justify adminHeaderIconsLastTwo  ${currentUrl === "admin/complaints" ? "oColor" : "text-white"}`} aria-hidden="true"></i>
                    </Link>
                    <span
                        className={`footLinkName ${currentUrl === "admin/complaints" ? "activeLinkOfHeader" : ""}`}>Complaints
                    </span>
                </div>


            </div>
        </footer>
    )
}
