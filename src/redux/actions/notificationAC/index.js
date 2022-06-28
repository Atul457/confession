export const notiActionTypes = {
    'OPENPOPUP' : 'NOTIFICATIONOPENPOPUP',
    'CLOSEPOPUP' : 'NOTIFICATIONCLOSEPOPUP',
    'UPDATEPOPUP' : 'UPDATENOTIFICATIONPOPUPSTATE'
}


export const openNotiPopup = () => {
    return {
        type: notiActionTypes.OPENPOPUP
    }
}

export const updateNotiPopState = (payload) => {
    return {
        type: notiActionTypes.UPDATEPOPUP,
        payload
    }
}


export const closeNotiPopup = () => {
    return {
        type: notiActionTypes.CLOSEPOPUP
    }
}