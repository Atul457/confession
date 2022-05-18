import {  useState } from 'react'
import ShareKit from '../shareKit/ShareKit';

export default function useShareKit() {

    const [sharekit, setShareKit] = useState(false);
    const toggleSharekit = () => {
        sharekit === true ? setShareKit(false) : setShareKit(true);
    }
    const hideShareKit = () => {
        setShareKit(false);
    }

    return [sharekit, toggleSharekit, ShareKit, hideShareKit];
}
