// export const Share = (index) => {
//     return dispatch => {
//         dispatch({
//             type: 'SHARE',
//             index
//         })
//     };
// }


// export const shareKitAc = (index) => {
//     return dispatch => {
//         dispatch({
//             type: 'SHAREKIT',
//             index
//         })
//     };
// }


// export const reset = () => {
//     return dispatch => {
//         dispatch({
//             type: 'RESET'
//         })
//     };
// }


// export const toggleShare = (index) => {
    
//     return dispatch => {
//         dispatch({
//             type: 'TOGGLESHARE',
//             index
//         })
//     };
// }

export const togglemenu = (id, value) => {
        return dispatch => {
            dispatch({
                type: 'TOGGLEMENU',
                postid: id,
                menuShow : value
            })
        }
}

export const toggleSharekitMenu = (value) => {
    return dispatch => {
        dispatch({
            type: 'TOGGLESHAREKIT',
            sharekitShow : value
        })
    }
}