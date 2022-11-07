import { useState } from 'react'
import ShareKit from '../../user/shareKit/ShareKit';

export default function useShareKit() {

    const [sharekit, setShareKit] = useState(false);
    const toggleSharekit = () => {
        sharekit === true ? setShareKit(false) : setShareKit(true);
    }

    const hideShareKit = () => {
        console.log("hidesharekit")
        setShareKit(false);
    }

    return [sharekit, toggleSharekit, ShareKit, hideShareKit];
}
