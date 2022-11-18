import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function RefreshButton() {

    // Hooks and vars
    const navigate = useNavigate()

    // Functions

    // Reloads the page
    const reloadPage = () => {
        navigate(0);
    }

    return (
        <i type="button" className="fa fa-refresh feedRefreshBtn" aria-hidden="true" onClick={reloadPage}></i>
    )
}
