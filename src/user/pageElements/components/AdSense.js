import React, { useEffect } from 'react';
import { envConfig } from '../../../configs/envConfig';

const AdSense_ = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    if (!envConfig.isProdMode) return null

    return (
        <ins className="adsbygoogle"
            style={{ "display": "block" }}
            data-ad-client="ca-pub-7031631451622714"
            data-ad-slot="6867532774"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    )
}

const AdSenseSideAd = () => {

    const maxWidthToShowAd = 1200
    let windowWidth = window.innerWidth,
        showAd = windowWidth > maxWidthToShowAd

    useEffect(() => {
        if (showAd) (window.adsbygoogle = window.adsbygoogle || []).push({});
        const handleShowAd = () => {
            windowWidth = window.innerWidth
            if (windowWidth < maxWidthToShowAd) showAd = false
            if (windowWidth > maxWidthToShowAd) showAd = true
        }

        window.addEventListener("resize", handleShowAd)

        return () => {
            window.removeEventListener("resize", handleShowAd)
        }
    }, [])

    if (!envConfig.isProdMode) return null

    if (showAd)
        return (
            <ins className="adsbygoogle"
                style={{ "display": "block" }}
                data-ad-client="ca-pub-7031631451622714"
                data-ad-slot="8349198779"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        )

    return null
}

export default AdSense_
export { AdSenseSideAd }