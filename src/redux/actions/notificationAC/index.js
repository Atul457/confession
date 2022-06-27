export const notiActionTypes = {
    'OPENPOPUP' : 'NOTIFICATIONOPENPOPUP',
    'CLOSEPOPUP' : 'NOTIFICATIONCLOSEPOPUP'
}


export const openNotiPopup = () => {
    return {
        type: notiActionTypes.OPENPOPUP
    }
}


export const closeNotiPopup = () => {
    return {
        type: notiActionTypes.CLOSEPOPUP
    }
}