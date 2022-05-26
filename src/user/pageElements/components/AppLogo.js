import React from 'react';
import logo from '../../../images/appLogo.svg'


const AppLogo = () => {
    return (
        <div className="appLogo">
            <img src={logo} alt="" />
            <span className='betaLogo'>BETA</span>
        </div>
    )
}

export default AppLogo