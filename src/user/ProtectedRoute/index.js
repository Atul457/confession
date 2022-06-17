import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import auth from '../behindScenes/Auth/AuthCheck'

const ProtectedRoute = () => {

    if (auth() === false) {
        return <Navigate to="/login" />
    }

    return <Outlet/>

}

export default ProtectedRoute