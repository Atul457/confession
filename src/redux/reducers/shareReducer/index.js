const initialState = {
    // sharekit: {
    //     index: false
    // },
    // popup: {
    //     index: false
    // }

    selectedPost : null,
    menuShow: false,
    sharekitShow: false

}

const ShareReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLEMENU' : 
        return {
            ...state,
            selectedPost: action.postid,
            menuShow: action.menuShow
        }
        case 'TOGGLESHAREKIT' : 
        return {
            ...state,
            sharekitShow: action.sharekitShow
        }
        default:
            return state
    }
}

// const ShareReducer = (state = initialState, action) => {
//     // console.log(action);
//     switch (action.type) {
//         case 'SHARE':
//             return {
//                 popup: {
//                     index: action.index
//                 },
//                 sharekit: {
//                     index: false
//                 },

//             }

//         case 'SHAREKIT':
//             return {
//                 sharekit: {
//                     index: action.index
//                 },
//                 popup: {
//                     index: false
//                 }
//             }

//         case 'RESET':
//             return initialState;

//         case 'TOGGLESHARE':
//             return {
//                 sharekit: {
//                     index: false
//                 },
//                 popup: {
//                     index: state.popup.index === false ? action.index : false
//                 }
//             };

//         default:
//             return state
//     }
// }

export default ShareReducer