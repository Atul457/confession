//Login Register Sidebar

import React from 'react'
import { Link } from 'react-router-dom'
import AppLogo from '../AppLogo'


export default function LgSidebar(props) {
    return (
        <div className="leftColumn">
            <div className="leftColumnWrapper">
                <div className="appLogo">
                    <AppLogo />
                </div>

                <Link to={`${props?.removeLink === true ? "#" : "/home"}`} className='textDecNone'>
                    <div className="middleContLoginReg">
                        <div className="confesstText">
                            {props.middleTitle}
                        </div>
                        <div className="loginInfoCont">
                            {props.middleTextBody}
                        </div>
                    </div>
                </Link>

                <div className={`bottomContLoginReg ${props.hidden === true && "hiddenImg"}`}>
                    <Link to={`${props?.removeLink ? "#" : "/createPost"}`} className='textDecNone'>
                        <img src={props.bottomLogo} alt="" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
