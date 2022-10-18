import React from 'react';
import { FaTwitter, FaFacebookF, FaEnvelope, FaLinkedinIn } from 'react-icons/fa';
import { ShareButtonRoundSquare, ShareBlockStandard } from 'react-custom-share';
import { copyTextToClipboard } from '../../helpers/copyTextToClipboard';

const ShareKit = (props) => {

    var data = props.postData;
    var origin = window.location.origin;

    // CREATE OBJECT WITH PROPS FOR SHAREBLOCK
    const shareBlockProps = {
        url: `${origin}/shareconfession/${data.confession_id}`,
        button: ShareButtonRoundSquare,
        buttons: [
            { network: 'Twitter', icon: FaTwitter },
            { network: 'Facebook', icon: FaFacebookF },
            { network: 'Email', icon: FaEnvelope },
            { network: 'Linkedin', icon: FaLinkedinIn },
        ],
        text: `Check out this anonymous post! - www.thetalkplace.com`,
        longtext: `${data.description.substr(0, 500)}${(data.description).length > 500 ? "..." : ""}`,
    };

    const copylink = () => {
        console.log("copied");
        copyTextToClipboard(`${origin}/confession/${data.confession_id}`)
    }

    return (
        <div className="shareKitButtonsMainCont parent">
            <ShareBlockStandard {...shareBlockProps} className="shareKitButtonsMainCont" />
            <span className='copyLinkBtn' onClick={copylink}>
                <i className="fa fa-files-o" aria-hidden="true"></i>
            </span>
        </div>
    )
}

export default ShareKit;