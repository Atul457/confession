//Login Register Sidebar

import React from 'react'
import { Link } from 'react-router-dom'

export default function LgSidebar(props) {
    return (
        <div className="leftColumn">
            <div className="leftColumnWrapper">
                <div className="appLogo">
                    <Link to="/home">
                        <img src={props.logo} alt="" />
                    </Link>
                </div>

                <Link to="/home" className='textDecNone'>
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
                    <Link to="/createPost" className='textDecNone'>
                        <img src={props.bottomLogo} alt="" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
