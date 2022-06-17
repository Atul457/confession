import React from 'react';
import { FaTwitter, FaFacebookF, FaEnvelope, FaLinkedinIn } from 'react-icons/fa';
import { ShareButtonRoundSquare, ShareBlockStandard } from 'react-custom-share';

const ShareKit = (props) => {

    var data = props.postData;
    var origin = window.location.origin;
    // var origin = "https://cloudart.com.au";

    // CREATE OBJECT WITH PROPS FOR SHAREBLOCK
    const shareBlockProps = {
        url: `${origin}/confession/${data.confession_id}`,
        button: ShareButtonRoundSquare,
        buttons: [
            { network: 'Twitter', icon: FaTwitter },
            { network: 'Facebook', icon: FaFacebookF },
            { network: 'Email', icon: FaEnvelope },
            { network: 'Linkedin', icon: FaLinkedinIn },
        ],
        text: `Check out this anonymous post! - www.thetalkplace.com`,
        longtext: `${data.description.substr(0,500)}${(data.description).length > 500 ? "..." : ""}`,
    };

    return (
        <ShareBlockStandard {...shareBlockProps} className="shareKitButtonsMainCont"/>
    )
}

export default ShareKit;