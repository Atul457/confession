import React from 'react'
import { toast } from 'react-toastify'
import appLogo from "../../images/applogo12.jpg"


const Toaster = ({ message }) => {
    return (
        <div className='toastBody'>
            <img src={appLogo} width="30" height="20" />
            <span>{message}</span>
        </div>
    )
}

const toaster = (message, isError) => {
    toast(<Toaster message={message} isError={isError} />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

const info = (message) => {
    toaster(message, false)
}

const toastMethods = {
    info
}

export default toastMethods