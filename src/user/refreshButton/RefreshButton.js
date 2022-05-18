import React from 'react'

export default function RefreshButton() {

    const reloadPage = () => {
        window.location.href = window.location.href;
    }

    return (
        <i type="button" className="fa fa-refresh feedRefreshBtn" aria-hidden="true" onClick={reloadPage}></i>
    )
}
