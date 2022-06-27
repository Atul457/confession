import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import auth from '../behindScenes/Auth/AuthCheck'


const ProtectedRoute = () => {

    const path = useLocation().pathname.replace("/", "");

    if (auth() === false && path !== 'login') {
        return <Navigate to="/login" />
    }

    if(auth() === true && path === 'login'){
        return <Navigate to="/home" />
    }

    return <Outlet />

}

export default ProtectedRoute