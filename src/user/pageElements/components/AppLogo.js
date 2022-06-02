import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../images/appLogo.svg'


const AppLogo = () => {
    return (
        <div className="appLogo">
            <Link to="/home">
                <img src={logo} alt="" />
                <span className='betaLogo'>BETA</span>
            </Link>
        </div>
    )
}

export default AppLogo