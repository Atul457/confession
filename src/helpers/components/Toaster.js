import React from 'react'
import { toast } from 'react-toastify'
import appLogo from "../../images/applogo12.jpg"
import { useNavigate } from 'react-router-dom'


const Toaster = ({ message, confDetails }) => {

    const navigate = useNavigate()
    const confession_link = `/confession/${confDetails.slug}`
    const type = parseInt(confDetails.type)

    const navigateToConfession = () => {
        if (type === 1) return navigate(confession_link)
        navigate("/chat")
    }
    return (
        <div className='toastBody' onClick={navigateToConfession}>
            <img src={appLogo} width="30" height="20" />
            <span>{message}</span>
        </div>
    )
}

const Toaster2 = ({ message }) => {
    return (
        <div className='toastBody'>
            <img src={appLogo} width="30" height="20" />
            <span>{message}</span>
        </div>
    )
}

const toaster = (message, data) => {
    toast(<Toaster message={message} confDetails={data} />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

const toaster2 = (message) => {
    console.log("toasted")
    toast(<Toaster2 message={message} />, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

const info = (message, data) => {
    toaster(message, data)
}

const toaster2Info = (message) => {
    console.log({ message });
    toaster2(message)
}

const toastMethods = {
    info,
    toaster2Info
}


export default toastMethods