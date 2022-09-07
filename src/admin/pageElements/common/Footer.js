import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { useLocation } from 'react-router';

export default function Footer() {

    let useLocations = useLocation();
    let currentUrl = (useLocations.pathname).replace("/", "");
    const isReportedItemActive = currentUrl === "admin/reportedposts" || currentUrl === "admin/reported" || currentUrl === "admin/reportedComments"


    return (
        <footer className="col-12 d-block d-md-none footer">
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


                {/* <div className="linkBtns">
                    <Link to="/admin/reportedposts" className="linkBtnsAnchor headerLinks">
                        <i className={`fa fa-exclamation-triangle moveABit adminHeaderIcons ${currentUrl === "admin/reportedposts" ? "oColor" : "text-white"}`} aria-hidden="true"></i>

                    </Link>
                </div>

                <div className="linkBtns">
                    <Link to="/admin/reported" className="linkBtnsAnchor">
                        <i className={`fa fa-flag-o moveABit adminHeaderIcons  ${currentUrl === "admin/reported" ? "oColor" : "text-white"}`} aria-hidden="true"></i>
                    </Link>
                </div>


                <div className="linkBtns">
                    <Link to="/admin/reportedComments" className="linkBtnsAnchor">
                        <i className={`fa fa-file adminHeaderIconsLastTwo  ${currentUrl === "admin/complaints" ? "oColor" : "text-white"}`} aria-hidden="true"></i>
                    </Link>
                </div> */}

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
