import React, {useEffect} from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";


export default function Privacy() {

    useEffect(() => {
        window.scrollTo({ top: "0px", behavior: "smooth" });
    }, [])
    

    return (
        <div className="container-fluid">
            <div className="row">
                <Header links={true} fullWidth={true} />
                <div className="preventHeader">preventHead</div>
                <div className="container py-md-4 p-3 preventFooter">
                    <div className="privacyCont">
                        <h3 className="privacyHead text-center">
                            <span>Privacy Policy</span>
                        </h3>

                        <div className="privacyText mt-4">
                            <div className="privacySeperateConts">
                                Thank you for choosing to be part of our community at The Talk Place, owned by Javon Technology Limited ("Company," "we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us using the Contact Us form on the site or at <a className="viewMoreBtn" href="mailto:support@javontech.com">support@javontech.com</a>
                            </div>


                            <div className="privacySeperateConts">
                                The purpose of this privacy notice is to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
                            </div>


                            <div className="privacySeperateConts font-weight-bold">
                                Please read this privacy notice carefully, as it will help you understand what we do with the information that we collect.
                            </div>


                            <div className="privacySeperateConts font-weight-bold">
                                <span className='privacySubConthead'>
                                    TABLE OF CONTENTS
                                </span>

                                <ol className="privacyOl mt-1">
                                    <li>WHAT INFORMATION DO WE COLLECT?</li>
                                    <li>HOW DO WE USE YOUR INFORMATION?</li>
                                    <li>WILL YOUR INFORMATION BE SHARED WITH ANYONE?</li>
                                    <li>HOW LONG DO WE KEEP YOUR INFORMATION?</li>
                                    <li>HOW DO WE KEEP YOUR INFORMATION SAFE?</li>
                                    <li>DO WE COLLECT INFORMATION FROM MINORS?</li>
                                    <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
                                    <li>CONTROLS FOR DO-NOT-TRACK FEATURES</li>
                                    <li>DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</li>
                                    <li>DO WE MAKE UPDATES TO THIS NOTICE?</li>
                                    <li>HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</li>
                                </ol>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    1) WHAT INFORMATION DO WE COLLECT?

                                    <div className="head">
                                        Personal information you disclose to us
                                    </div>
                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>We collect personal information that you provide to us.</span>
                                        </div>


                                        <div className="subbody">
                                            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our Services, when you participate in activities on the Website or otherwise when you contact us.
                                        </div>
                                        <div className="subbody">
                                            The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the features you use. The personal information we collect may include the following:
                                        </div>
                                    </div>


                                    <div className="body">
                                        <div className='subhead'>Personal Information Provided by You.
                                            <span className='value'> We collect email addresses, usernames, dates of birth and other similar information.</span>
                                        </div>


                                        <div className="subbody">
                                            All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.
                                        </div>
                                    </div>


                                    <div className="head">
                                        Information automatically collected
                                    </div>
                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Website..</span>
                                        </div>


                                        <div className="subbody">
                                            We automatically collect certain information when you visit, use or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website and other technical information. This information is primarily needed to maintain the security and operation of our Website, and for our internal analytics and reporting purposes.
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    2. HOW DO WE USE YOUR INFORMATION?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'> We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.</span>
                                        </div>


                                        <div className="subbody">
                                            We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
                                        </div>

                                        <div className="subbody">
                                            We use the information we collect or receive:
                                            <ul className='privacyUl mt-1'>
                                                <li>
                                                    <span className="head">
                                                        Request feedback.
                                                    </span>
                                                    <span className="body">
                                                        We may use your information to request feedback and to contact you about your use of our Website.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        To send administrative information to you.
                                                    </span>
                                                    <span className="body">
                                                        We may use your personal information to send you new features information and/or information about changes to our terms, conditions, and policies.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        To protect our Services.
                                                    </span>
                                                    <span className="body">
                                                        We may use your information as part of our efforts to keep our Website safe and secure (for example, for fraud monitoring and prevention).
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        To respond to legal requests and prevent harm.
                                                    </span>
                                                    <span className="body">
                                                        If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        To send you marketing and promotional communications.
                                                    </span>
                                                    <span className="body">
                                                        We and/or our third-party marketing partners may use the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. For example, when expressing an interest in obtaining information about us or our Website, subscribing to marketing or otherwise contacting us, we will collect personal information from you. You can opt-out of our marketing emails at any time (see the "WHAT ARE YOUR PRIVACY RIGHTS?" below).
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        Deliver targeted advertising to you.
                                                    </span>
                                                    <span className="body">
                                                        We may use your information to develop and display personalized content and advertising (and work with third parties who do so) tailored to your interests and/or location and to measure its effectiveness.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        For other business purposes.
                                                    </span>
                                                    <span className="body">
                                                        We may use your information for other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, marketing and your experience. We may use and store this information in aggregated and anonymized form so that it is not associated with individual end users and does not include personal information. We will not use identifiable personal information without your consent.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</span>
                                        </div>


                                        <div className="subbody">
                                            We may process or share your data that we hold based on the following legal basis:
                                        </div>

                                        <div className="subbody">
                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="head">
                                                        Consent:
                                                    </span>
                                                    <span className="body">
                                                        We may process your data if you have given us specific consent to use your personal information for a specific purpose.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        Legitimate Interests:
                                                    </span>
                                                    <span className="body">
                                                        We may process your data when it is reasonably necessary to achieve our legitimate business interests.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        Performance of a Contract:
                                                    </span>
                                                    <span className="body">
                                                        Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        Legal Obligations:
                                                    </span>
                                                    <span className="body">
                                                        We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal processes, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements).
                                                    </span>
                                                </li>

                                                <li>
                                                    <span className="head">
                                                        Vital Interests:
                                                    </span>
                                                    <span className="body">
                                                        We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="subbody">
                                            More specifically, we may need to process your data or share your personal information in the following situations:
                                        </div>

                                        <div className="subbody">
                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="head">
                                                        Business Transfers.
                                                    </span>
                                                    <span className="body">
                                                        We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    4. HOW LONG DO WE KEEP YOUR INFORMATION?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</span>
                                        </div>

                                        <div className="subbody">
                                            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
                                        </div>

                                        <div className="subbody">
                                            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* fifth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    5. HOW DO WE KEEP YOUR INFORMATION SAFE?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>We aim to protect your personal information through a system of organizational and technical security measures.</span>
                                        </div>

                                        <div className="subbody">
                                            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* fifth */}


                            {/* sixth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    6. DO WE COLLECT INFORMATION FROM MINORS?

                                    <div className="body">
                                        <div className='subhead'>
                                            In Short :
                                            <span className='value'>
                                                We do not knowingly collect data from or market to children under 18 years of age.
                                            </span>
                                        </div>

                                        <div className="subbody">
                                            We do not knowingly solicit data from or market to children under 18 years of age. By using the Website, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Website. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us through the Contact Us form on the site or via email at&nbsp;
                                            <a className="viewMoreBtn" href="mailto:support@javontech.com">
                                                support@javontech.com
                                            </a>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* sixth */}

                            {/* seventh */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    7. WHAT ARE YOUR PRIVACY RIGHTS?

                                    <div className="body">
                                        <div className='subhead'>
                                            In Short :
                                            <span className='value'>
                                                n some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.
                                            </span>
                                        </div>

                                        <div className="subbody">
                                            In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right <br />
                                            (i) to request access and obtain a copy of your personal information,<br />
                                            (ii) to request rectification or erasure;<br />
                                            (iii) to restrict the processing of your personal information; and <br />
                                            (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided below. We will consider and act upon any request in accordance with applicable data protection laws.
                                        </div>

                                        <div className="subbody">
                                            If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. Please note however that this will not affect the lawfulness of the processing before its withdrawal, nor will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
                                        </div>

                                        <div className="subbody">
                                            If you are a resident in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here: <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html">https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html.</a>
                                        </div>

                                        <div className="subbody">
                                            If you are a resident in Switzerland, the contact details for the data protection authorities are available here: <a href="https://www.edoeb.admin.ch/edoeb/en/home.html">https://www.edoeb.admin.ch/edoeb/en/home.html.</a>
                                        </div>
                                    </div>


                                    <div className="head">
                                        GENERAL DATA PROTECTION REGULATION (GDPR)
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            If you are from the European Economic Area (EEA), Javon Technology Limited legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Data we collect and the specific context in which we collect it.
                                        </div>
                                        <div className="subbody">
                                            Javon Technology Limited may process your Personal Data because:<br />
                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="body">
                                                        We need to perform a contract with you
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        You have given us permission to do so
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The processing is in our legitimate interests and it’s not overridden by your rights
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        For payment processing purposes
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        To comply with the law
                                                    </span>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>

                                    <div className="head">
                                        Retention of Data
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            Javon Technology Limited will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                                        </div>
                                        <div className="subbody">
                                            Javon Technology Limited will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.
                                        </div>
                                    </div>


                                    <div className="head">
                                        Transfer of Data
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.<br />
                                            Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
                                        </div>
                                        <div className="subbody">
                                            Javon Technology Limited will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unlessthere are adequate controls in place including the security of your data and other personal information.
                                        </div>
                                    </div>


                                    <div className="head">
                                        Disclosure of Data. Legal Requirements
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            Javon Technology Limited may disclose your Personal Data in the good faith belief that such action is necessary to:
                                            <br />
                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="body">
                                                        To comply with a legal obligation
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        To protect and defend the rights or property of Javon Technology Limited
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        To prevent or investigate possible wrongdoing in connection with the Service
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        To protect the personal safety of users of the Service or the public
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        To protect against legal liability
                                                    </span>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>


                                    <div className="head">
                                        Security of Data
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                                        </div>
                                    </div>



                                    <div className="head">
                                        Your rights under the GDPR
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            If you are a resident of the European Economic Area (EEA), you have certain data protection rights. Javon Technology Limited aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                                            If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.
                                        </div>

                                        <div className="subbody">
                                            In certain circumstances, you have the following data protection rights:
                                            <br />
                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="body">
                                                        The right to access, update or to delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The right of rectification. You have the right to have your information rectified if that information is inaccurate or incomplete.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The right to object. You have the right to object to our processing of your Personal Data.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The right of restriction. You have the right to request that we restrict the processing of your personal information.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The right to data portability. You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The right to withdraw consent. You also have the right to withdraw your consent at any time where Javon Technology Limited relied on your consent to process your personal information.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="subbody">
                                            Please note that we may ask you to verify your identity before responding to such requests.
                                            <br />

                                            You have the right to complain to a Data Protection Authority about our collection and use of your Personal Data. For more information, please contact your local data protection authority in the European Economic Area (EEA).
                                        </div>

                                        <div className="subbody">
                                            If you are a resident in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details here:
                                            <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html">https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.html.</a>
                                        </div>

                                        <div className="subbody">
                                            If you are a resident in Switzerland, the contact details for the data protection authorities are available here:
                                            <a href="https://www.edoeb.admin.ch/edoeb/en/home.html">https://www.edoeb.admin.ch/edoeb/en/home.html.</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* seventh */}

                            {/* eighth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    8. CONTROLS FOR DO-NOT-TRACK FEATURES

                                    <div className="body">
                                        <div className="subbody">
                                            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* eighth */}


                            {/* ninth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    9. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</span>
                                        </div>
                                        <div className="subbody">
                                            California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
                                        </div>
                                        <div className="subbody">
                                            If you are under 18 years of age, reside in California, and have a registered account with the Website, you have the right to request removal of unwanted data that you publicly post on the Website. To request removal of such data, please contact us using the contact information provided below, and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Website, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g. backups, etc.).
                                        </div>
                                    </div>


                                    <div className="head">
                                        CCPA Privacy Notice
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            The California Code of Regulations defines a "resident" as:
                                            <br />

                                            <ol className="privacyOl mt-1">
                                                <li>Every individual who is in the State of California for other than a temporary or transitory purpose and</li>
                                                <li>Every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
                                            </ol>

                                        </div>

                                        <div className="subbody">
                                            All other individuals are defined as "non-residents."
                                            <br />
                                            If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.
                                        </div>
                                    </div>


                                    <div className="head">
                                        How do we use and share your personal information?
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            More information about our data collection and sharing practices can be found in this privacy notice.
                                            <br />

                                            You may contact us at <a className="viewMoreBtn" href="mailto:support@javontech.com">support@javontech.com</a>.
                                        </div>

                                        <div className="subbody">
                                            If you are using an authorized agent to exercise your right to opt-out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
                                        </div>
                                    </div>


                                    <div className="head">
                                        Will your information be shared with anyone else?
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf.
                                            <br />

                                            We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be "selling" of your personal data.
                                        </div>
                                    </div>


                                    <div className="head">
                                        Your rights with respect to your personal data
                                    </div>
                                    <div className="body">
                                        <div className="subbody">
                                            <span className='underline'>Right to request deletion of the data - Request to delete</span>
                                            <br />

                                            You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) if another consumer exercises his or her right to free speech, if we need to comply with a legal obligation or if we need to process your data to protect against illegal activities.
                                        </div>

                                        <div className="subbody">
                                            <span className='underline'>Right to be informed - Request to know</span>
                                            <br />

                                            Depending on the circumstances, you have a right to know:

                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="body">
                                                        Whether we collect and use your personal information;
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The categories of personal information that we collect;
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        Whether we sell your personal information to third parties;
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The categories of personal information that we sold or disclosed for a business purpose;
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The categories of third parties to whom the personal information was sold or disclosed for a business purpose; and
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        The business or commercial purpose for collecting or selling personal information.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="subbody">
                                            In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.
                                        </div>


                                        <div className="subbody">
                                            <span className='underline'>Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights</span>
                                            <br />

                                            We will not discriminate against you if you exercise your privacy rights.
                                        </div>


                                        <div className="subbody">
                                            <span className='underline'>Verification process</span>
                                            <br />

                                            Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g. phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.
                                        </div>

                                        <div className="subbody">
                                            We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. If, however, we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity, and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.
                                        </div>

                                        <div className="subbody">
                                            <span className='underline'>Other privacy rights</span>
                                            <br />

                                            <ul className='privacyUl'>
                                                <li>
                                                    <span className="body">
                                                        You may object to the processing of your personal data
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the data
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="body">
                                                        you may request to opt-out from future selling of your personal information to third parties. Upon receiving a request to opt-out, we will act upon the request as soon as feasibly possible, but no later than 15 days from the date of the request submission.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>


                                        <div className="subbody">
                                            To exercise these rights, you can contact us at <a className="viewMoreBtn" href="mailto:support@javontech.com">Support@javontech.com</a>. If you have a complaint about how we handle your data, we would like to hear from you.
                                        </div>


                                    </div>
                                </div>
                            </div>
                            {/* ninth */}


                            {/* tenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    10. DO WE MAKE UPDATES TO THIS NOTICE?

                                    <div className="body">
                                        <div className='subhead'>In Short :
                                            <span className='value'>Yes, we will update this notice as necessary to stay compliant with relevant laws.</span>
                                        </div>

                                        <div className="subbody">
                                            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* tenth */}

                            {/* eleventh */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?

                                    <div className="body">
                                        <div className="subbody">
                                            If you have questions or comments about this notice, you may email us at <a className="viewMoreBtn" href="mailto:support@javontech.com">support@javontech.com</a>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* eleventh */}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>

    )
}
