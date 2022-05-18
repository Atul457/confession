import React, { useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";

const CookiePolicy = () => {

    useEffect(() => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }, [])

    return (
        <>
            <div className="container-fluid" >
                <div className="row">
                    <Header links={true} fullWidth={true} />
                    <div className="preventHeader">preventHead</div>
                    <div className="container py-md-4 p-3 preventFooter">
                        <div className="privacyCont">
                            <h3 className="privacyHead text-center">
                                <span>Cookies Policy</span>
                            </h3>

                            <div className="privacyText mt-4">
                                <div className="privacySeperateConts">
                                    Here on this website (the "Website"), we use cookies to make your overall experience on our Website better. Specifically, we use cookies to:<br />

                                    <div className="_fields">
                                        <div className="innerLi">
                                            Store information for the time you are on the Website (called "Session Cookies")
                                        </div>
                                        <div className="innerLi">
                                            Store information to recognize your browser or device each time you visit (called "Persistent Cookies")
                                        </div>
                                        <div className="innerLi">
                                            Store your login and password information, if you choose to
                                        </div>
                                        <div className="innerLi">
                                            Store your user settings, like audio and display settings
                                        </div>
                                        <div className="innerLi">
                                            Analyze your behavior on our Website, so we can continue to improve your experience
                                        </div>
                                        <div className="innerLi">
                                            Allow others to advertise on our Website or track information about you to improve advertising to you
                                        </div>
                                    </div>

                                    <div className="subbody">
                                        By using our Website or any of our services, you consent to our use of cookies. This Cookies Policy will explain what cookies are, how we use them, and what your rights are in relation to our use of cookies. We'll also discuss our third-party cookies and what they mean for you.
                                    </div>
                                </div>


                                <div className="privacySeperateConts">
                                    <div className="privacySubConthead cookie">
                                        <span> What are cookies? </span>
                                        <div className="body mt-2">
                                            <div className="subbody">
                                                Technical cookies, which can also sometimes be called HTML cookies, are used for navigation and to facilitate your access to and use of the site. They are necessary for the transmission of communications on the network or to supply services requested by you. The use of technical cookies allows the safe and efficient use of the Website.
                                            </div>
                                            <div className="subbody">
                                                You can manage or request the general deactivation or cancelation of cookies through your browser. If you do this though, please be advised this action might slow down or prevent access to some parts of the Website.
                                            </div>
                                            <div className="subbody">
                                                We also use cookies that are retransmitted by an analytics or statistics provider to collect aggregated information on the number of users and how they visit the Website. These are also considered technical cookies when they operate as described.
                                            </div>
                                            <div className="subbody">
                                                Analytics may collect information through log data, such as:
                                            </div>

                                            <div className="_fields">
                                                <div className="innerLi">
                                                    Internet protocol (IP) address;
                                                </div>
                                                <div className="innerLi">
                                                    Type of browser and device;
                                                </div>
                                                <div className="innerLi">
                                                    Operating system;
                                                </div>
                                                <div className="innerLi">
                                                    Name of the Internet Service Provider (ISP);
                                                </div>
                                                <div className="innerLi">
                                                    Country information
                                                </div>
                                                <div className="innerLi">
                                                    Date and time of visit;
                                                </div>
                                                <div className="innerLi">
                                                    Web page of origin (referral) and exit;
                                                </div>
                                                <div className="innerLi">
                                                    Possibly the number of clicks.
                                                </div>
                                            </div>

                                            <div className="subbody">
                                                We don't use this information to identify you, but rather to understand usage trends on our Website.
                                            </div>
                                            <div className="subbody">
                                                We use session cookies to keep track of how you browse on your visits to the Website. Temporary session cookies are deleted automatically at the end of the browsing session - these are mostly used to keep track of what you do from page to page, such as with online shopping, keeping track of what is in your cart.
                                            </div>
                                            <div className="subbody">
                                                Persistent cookies, on the other hand, remain active longer than just one particular session. These help us recognize you.We also use them to store your login and password info, if you choose, and to store your user settings.
                                            </div>
                                            <div className="subbody">
                                                Third-party cookies: We also utilize third-party cookies, which are cookies sent by a third-party to your computer. Persistent cookies are often third-party cookies. The majority of third-party cookies consist of tracking cookies used to identify online behavior, understand interests and then customize advertising for you.
                                            </div>
                                            <div className="subbody">
                                                We use remarketing cookies, which place files on your browser or device to allow us to display advertisements to you on other websites.
                                            </div>
                                            <div className="subbody">
                                                When these types of cookies are used, we will ask for your explicit consent.
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="privacySeperateConts">
                                    <div className="privacySubConthead cookie">
                                        Consent

                                        <div className="body">
                                            <div className="subbody">
                                                When you arrive to our Website, we will request your consent for cookies through a clearly visible cookie banner/ notice at the user’s first visit.
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="privacySeperateConts">
                                    <div className="privacySubConthead cookie">
                                        What can you do about cookies?

                                        <div className="body">

                                            <div className="subbody">
                                                If you want, you can prevent the use of cookies, but then you may not be able to use our Website as we intend. To proceed without changing the options related to cookies, simply continue to use our Website.
                                            </div>
                                            
                                            <div className="subbody">
                                                You can also manage cookies through the settings of your browser on your device. However, deleting cookies from your browser may remove the preferences you have set for the Website, as well as preferences you've set for other websites.
                                            </div>
                                            
                                            <div className="subbody">
                                                For further information and support, you can also visit the specific help page of the web browser you are using:
                                            </div>

                                            <div className="_fields">
                                                <div className="innerLi">
                                                    Internet Explorer: 
                                                    <a href="http://windows.microsoft.com/en-us/windows-vista/block-or-allow-cookies"> http://windows.microsoft.com/en-us/windows-vista/block-or-allow-cookies.</a>
                                                </div>
                                                <div className="innerLi">
                                                    Firefox: 
                                                    <a href="https://support.mozilla.org/en-us/kb/enable-and-disable-cookies-website-preferences"> https://support.mozilla.org/en-us/kb/enable-and-disable-cookies-website-preferences.</a>
                                                </div>
                                                <div className="innerLi">
                                                    Safari: 
                                                    <a href="http://www.apple.com/legal/privacy/"> http://www.apple.com/legal/privacy/.</a>
                                                </div>
                                                <div className="innerLi">
                                                    Chrome: 
                                                    <a href="https://support.google.com/accounts/answer/61416?hl=en"> https://support.google.com/accounts/answer/61416?hl=en.</a>
                                                </div>
                                                <div className="innerLi">
                                                    Opera: 
                                                    <a href="http://www.opera.com/help/tutorials/security/cookies/"> http://www.opera.com/help/tutorials/security/cookies/.</a>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className="privacySeperateConts">
                                    <div className="privacySubConthead cookie">
                                        How to contact us

                                        <div className="body">

                                            <div className="subbody">
                                                For any questions on our cookies policy, you can reach us at the following email: <a className="viewMoreBtn" href="mailto:support@javontech.com">
                                                    Support@javontech.com
                                                </a>.
                                            </div>

                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )

}

export default CookiePolicy;