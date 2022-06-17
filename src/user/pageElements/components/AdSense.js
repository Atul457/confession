import React, { useEffect } from 'react';
import AdSense from 'react-adsense';

// ads with no set-up


const AdSense_ = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    return (
        <ins className="adsbygoogle"
            style={{ "display": "block" }}
            data-ad-client="ca-pub-7031631451622714"
            data-ad-slot="6867532774"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    )
}

export default AdSense_