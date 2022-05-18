//Share and Request Popup

import { useState } from 'react';
import ShareRequestPopUp from '../PopUps/ShareRequestPopUp';

export default function useShareRequestPopUp() {

    const [shareReqPopUp, setShareReqPopup] = useState(false);
    
    const toggleShareReqPopUp = () => {
        setShareReqPopup(!shareReqPopUp);
    }
    
    const closeShareReqPopUp = () => {
        setShareReqPopup(false);
    }

    return [shareReqPopUp, toggleShareReqPopUp, ShareRequestPopUp, closeShareReqPopUp];
}
