import React from 'react'
import TwitterSocial from "../../images/TwitterSocial.svg"
import tiktokSocial from "../../images/tiktokSocial.svg"
import fbSocial from "../../images/fbSocial.svg"
import instaSocial from "../../images/instaSocial.svg"

const SocialIconsComp = () => {
    return (
        <>
            <div className='categoryHead pb-1'>
                Follow us on
            </div>
            <div className='socialLinksIconWrapperFeed'>
                <ul>
                    <li pulsate='07-07-22,pulsatingIcon social'>
                        <a target="blank" href="https://www.facebook.com/TheTalkPlaceOfficial">
                            <img src={fbSocial} alt="fbSocialIcon" />
                        </a>
                    </li>
                    <li pulsate='07-07-22,pulsatingIcon social'>
                        <a target="blank" href="http://twitter.com/the_talkplace">
                            <img src={TwitterSocial} alt="TwitterSocialIcon" />
                        </a>
                    </li>
                    <li pulsate='07-07-22,pulsatingIcon social'>
                        <a target="blank" href="https://www.instagram.com/the_talkplace_official/">
                            <img src={instaSocial} alt="instaSocialIcon" />
                        </a>
                    </li>
                    <li pulsate='07-07-22,pulsatingIcon social'>
                        <a target="blank" href="http://TikTok.com/@the_talkplace">
                            <img src={tiktokSocial} alt="tiktokSocialIcon" />
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SocialIconsComp