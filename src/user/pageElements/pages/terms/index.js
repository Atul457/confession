import React, { useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";


const Terms = () => {

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
                            <span>Terms of Service</span>
                        </h3>

                        <div className="privacyText mt-4">
                            <div className="privacySeperateConts">
                                <span className='font-weight-bold'>THE AGREEMENT:</span>
                                The use of this website and services on this website provided by Javon Technologies Limited (hereinafter referred to as "Company") are subject to the following Terms & Conditions (hereinafter the "Agreement"), all parts and sub-parts of which are specifically incorporated by reference here. This Agreement shall govern the use of all pages on this website (hereinafter collectively referred to as "Website") and any goods or services provided by or on this Website ("Services").
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    1) DEFINITIONS

                                    <div className="body mt-2">
                                        The parties referred to in this Agreement shall be defined as follows:


                                        <div className="subbody">
                                            <ol className="privacyOl mt-1" type='a'>
                                                <li>Company, Us, We: The Company, as the creator, operator, and publisher of the Website, makes the Website, and certain Services on it, available to users. Company, Us, We, Our, Ours and other first-person pronouns will refer to the Company, as well as all employees and affiliates of the Company.</li>
                                                <li>You, the User, the Client: You, as the user of the Website, will be referred to throughout this Agreement with second-person pronouns such as You, Your, Yours, or as User or Client.</li>
                                                <li>Parties: Collectively, the parties to this Agreement (the Company and You) will be referred to as Parties.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    2) ASSENT & ACCEPTANCE

                                    <div className="body">
                                        <div className="subbody">
                                            By using the Website, You warrant that You have read and reviewed this Agreement and that You agree to be bound by it. If You do not agree to be bound by this Agreement, please refrain from further use of the Website. The Company only agrees to provide use of this Website and Services to You if You assent to this Agreement.
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    3) OUR SERVICES

                                    <div className="body">

                                        <div className="subbody">
                                            Our website allows the users to post anonymous confessions, personal stories, anecdotes, jokes or any other similar content (each, a “Submitted Item”).
                                        </div>

                                        <div className="subbody">
                                            By voluntarily submitting a Submitted Item to this Site, you agree that such submissions are non-confidential for all purposes and you grant the Company and its affiliate Companies an irrevocable, nonexclusive, perpetual, worldwide, royalty-free, fully sublicensable, right and license to use, display, publicly perform, modify, reproduce, publish, distribute, adapt, make derivative works of, sublicense and otherwise commercially and non-commercially use your Submitted Items and all copyright, trade secret, trademark or other intellectual property rights therein, in any manner or medium now existing or hereafter developed (including but not limited to print, film or electronic storage devices), without compensation of any kind to you or any third party. By submitting material to us, you represent and warrant that you have full authority to grant the rights set forth above and that your material will not, in whole or in part, infringe the intellectual property rights, rights of privacy or publicity, or any other rights of any third party. You further represent and warrant that you have attained the legal age of majority in your state/province (18 in most states/provinces). Parent or guardian must submit on behalf of any minor. The submission of any Submitted Item in no way creates any obligation or duty on the part of Company to post or use such Submitted Item or, if we do so, to give you credit.
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    4) INTELLECTUAL PROPERTY

                                    <div className="body">

                                        <div className="subbody">
                                            You agree that the Website and all Services provided by the Company are the property of the Company, including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Company IP"). You agree that the Company owns all right, title and interest in and to the Company IP and that You will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or distribute the Company IP in any way, including electronically or via registration of any new trademarks, trade names, service marks or Uniform Resource Locators (URLs), without express written permission from the Company.
                                        </div>

                                        <div className="subbody">
                                            <ol className="privacyOl mt-1" type='a'>
                                                <li>In order to make the Website and Services available to You, You hereby grant the Company a royalty-free, non-exclusive, worldwide license to copy, display, use, broadcast, transmit and make derivative works of any content You publish, upload, or otherwise make available to the Website.</li>
                                                <li>If You feel that any of Your intellectual property rights have been infringed or otherwise violated by the posting of information or media by another of Our users, please contact Us and let Us know.</li>
                                            </ol>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            {/* fifth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    5) USER OBLIGATIONS

                                    <div className="body">
                                        <div className="subbody">
                                            As a user of the Website or Services, You may be asked to register with Us. When You do so, You will choose a user identifier, which may be Your email address or another term, as well as a password. You may also provide personal information, including, but not limited to, Your name. You are responsible for ensuring the accuracy of this information. This identifying information will enable You to use the Website and Services. You must not share such identifying information with any third party, and if You discover that Your identifying information has been compromised, You agree to notify Us immediately in writing. Email notification will suffice. You are responsible for maintaining the safety and security of Your identifying information as well as keeping Us apprised of any changes to Your identifying information. Using the Website or Services to further fraud or unlawful activity is grounds for immediate termination of this Agreement.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* fifth */}


                            {/* sixth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    6) ACCEPTABLE USE

                                    <div className="body">

                                        <div className="subbody">
                                            You agree not to use the Website or Services for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Website or Services in any way that could damage the Website or general business of the Company.
                                        </div>

                                        <div className="subbody">
                                            <ol className="privacyOl mt-1" type='a'>
                                                <li>You further agree not to use the Website:

                                                    <ol className="privacyOl mt-1" type='i'>
                                                        <li>To harass, abuse, or threaten others or otherwise violate any person's legal rights;</li>
                                                        <li>To violate any intellectual property rights of the Company or any third party;</li>
                                                        <li>To upload or otherwise disseminate any computer viruses or other software that may damage the property of another;</li>
                                                        <li>To perpetrate any fraud;</li>
                                                        <li>To engage in or create any unlawful gambling, sweepstakes, or pyramid scheme;</li>
                                                        <li>To publish or distribute any obscene or defamatory material;</li>
                                                        <li>To publish or distribute any material that incites violence, hate, or discrimination towards any group;</li>
                                                        <li>To unlawfully gather information about others.</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* sixth */}

                            {/* seventh */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    7) PRIVACY INFORMATION

                                    <div className="body">

                                        <div className="subbody">
                                            Through Your Use of the Website and Services, You may provide Us with certain information. By using the Website or the Services, You authorize the Company to use Your information at our headquarters and any other country where We may operate.
                                        </div>

                                        <div className="subbody">
                                            <ol className="privacyOl mt-1" type='a'>
                                                <li>Information We May Collect or Receive: When You register for an account, You provide Us with a valid email address and may provide Us with additional information, such as Your name or billing information. Depending on how You use Our Website or Services, We may also receive information from external applications that You use to access Our Website, or We may receive information through various web technologies, such as cookies, log files, clear gifs, web beacons or others.</li>
                                                <li>How We Use Information: We use the information gathered from You to ensure Your continued good experience on Our website, including through email communication. We may also track certain aspects of the passive information received to improve Our marketing and analytics, and for this, We may work with third-party providers.</li>
                                                <li>How You Can Protect Your Information: If You would like to disable Our access to any passive information We receive from the use of various technologies, You may choose to disable cookies in Your web browser. Please be aware that the Company will still receive information about You that You have provided, such as Your email address.</li>
                                            </ol>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {/* seventh */}

                            {/* eighth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    8) REVERSE ENGINEERING & SECURITY

                                    <div className="body">
                                        You agree not to undertake any of the following actions:
                                        <div className="subbody">

                                            <ol className="privacyOl mt-1" type='a'>
                                                <li>Reverse engineer, or attempt to reverse engineer or disassemble any code or software from or on the Website or Services;</li>
                                                <li>Violate the security of the Website or Services through any unauthorized access, circumvention of encryption or other security tools, data mining or interference to any host, user or network.</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* eighth */}


                            {/* ninth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    9) DATA LOSS

                                    <div className="body">
                                        <div className="subbody">
                                            The Company does not accept responsibility for the security of Your account or content. You agree that Your use of the Website or Services is at Your own risk.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ninth */}


                            {/* tenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    10) INDEMNIFICATION

                                    <div className="body">
                                        <div className="subbody">
                                            You agree to defend and indemnify the Company and any of its affiliates (if applicable) and hold Us harmless against any and all legal claims and demands, including reasonable attorney's fees, which may arise from or relate to Your use or misuse of the Website or Services, Your breach of this Agreement, or Your conduct or actions. You agree that the Company shall be able to select its own legal counsel and may participate in its own defense, if the Company wishes.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* tenth */}

                            {/* eleventh */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    11) SPAM POLICY

                                    <div className="body">
                                        <div className="subbody">
                                            You are strictly prohibited from using the Website or any of the Company's Services for illegal spam activities, including gathering email addresses and personal information from others or sending any mass commercial emails.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* eleventh */}


                            {/* twelfth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    12) THIRD-PARTY LINKS & CONTENT

                                    <div className="body">
                                        <div className="subbody">
                                            The Company may occasionally post links to third party websites or other services. You agree that the Company is not responsible or liable for any loss or damage caused as a result of Your use of any third-party services linked to from Our Website.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* twelfth */}


                            {/* thirteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    13) MODIFICATION & VARIATION

                                    <div className="body">
                                        <div className="subbody">
                                            The Company may, from time to time and at any time without notice to You, modify this Agreement. You agree that the Company has the right to modify this Agreement or revise anything contained herein. You further agree that all modifications to this Agreement are in full force and effect immediately upon posting on or use of the Website and that modifications or variations will replace any prior version of this Agreement, unless prior versions are specifically referred to or incorporated into the latest modification or variation of this Agreement.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* thirteenth */}


                            {/* fourteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    14) ENTIRE AGREEMENT

                                    <div className="body">
                                        <div className="subbody">
                                            This Agreement constitutes the entire understanding between the Parties with respect to any and all use of this Website. This Agreement supersedes and replaces all prior or contemporaneous agreements or understandings, written or oral, regarding the use of this Website.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* fourteenth */}


                            {/* fifteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    15) SERVICE INTERRUPTIONS

                                    <div className="body">
                                        <div className="subbody">
                                            The Company may need to interrupt Your access to the Website to perform maintenance or emergency services on a scheduled or unscheduled basis. You agree that Your access to the Website may be affected by unanticipated or unscheduled downtime, for any reason, but that the Company shall have no liability for any damage or loss caused as a result of such downtime.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* fifteenth */}


                            {/* sixteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    16) TERM, TERMINATION & SUSPENSION

                                    <div className="body">
                                        <div className="subbody">
                                            The Company may terminate this Agreement with You at any time for any reason, with or without cause. The Company specifically reserves the right to terminate this Agreement if You violate any of the terms outlined herein, including, but not limited to, violating the intellectual property rights of the Company or a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or distributing illegal material. If You have registered for an account with Us, You may also terminate this Agreement at any time by contacting Us and requesting termination. At the termination of this Agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* sixteenth */}


                            {/* seventeenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    17) NO WARRANTIES

                                    <div className="body">
                                        <div className="subbody">
                                            You agree that Your use of the Website and Services is at Your sole and exclusive risk and that any Services provided by Us are on an "As Is" basis. The Company hereby expressly disclaims any and all express or implied warranties of any kind, including, but not limited to the implied warranty of fitness for a particular purpose and the implied warranty of merchantability. The Company makes no warranties that the Website or Services will meet Your needs or that the Website or Services will be uninterrupted, error-free, or secure. The Company also makes no warranties as to the reliability or accuracy of any information on the Website or obtained through the Services. You agree that any damage that may occur to You, through Your computer system, or as a result of loss of Your data from Your use of the Website or Services is Your sole responsibility and that the Company is not liable for any such damage or loss.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* seventeenth */}


                            {/* eighteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    18) LIMITATION ON LIABILITY

                                    <div className="body">
                                        <div className="subbody">
                                            The Company is not liable for any damages that may occur to You as a result of Your use of the Website or Services, to the fullest extent permitted by law. The maximum liability of the Company arising from or relating to this Agreement is limited to the greater of one hundred (100) $ or the amount You paid to the Company in the last six (6) months. This section applies to any and all claims by You, including, but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability, fraud, or torts of any kind.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* eighteenth */}


                            {/* ninteenth */}
                            <div className="privacySeperateConts">
                                <div className="privacySubConthead">
                                    19) GENERAL PROVISIONS:

                                    <div className="body">
                                        <div className="subbody">
                                            <ol className='privacyUl mt-1' type="a">
                                                <li>
                                                    <span className="head">
                                                        LANGUAGE:&nbsp;
                                                    </span>
                                                    <span className="body">
                                                        All communications made or notices given pursuant to this Agreement shall be in the English language.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        JURISDICTION, VENUE & CHOICE OF LAW:&nbsp; 
                                                    </span>
                                                    <span className="body">
                                                        Through Your use of the Website or Services, You agree that the laws of the state in which Company has its headquarters shall govern any matter or dispute relating to or arising out of this Agreement, as well as any dispute of any kind that may arise between You and the Company, with the exception of its conflict of law provisions. In case any litigation specifically permitted under this Agreement is initiated, the Parties agree to submit to the personal jurisdiction of the state of in which Company has its headquarters. The Parties agree that this choice of law, venue, and jurisdiction provision is not permissive, but rather mandatory in nature. You hereby waive the right to any objection of venue, including assertion of the doctrine of forum non conveniens or similar doctrine.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        ASSIGNMENT:&nbsp; 
                                                    </span>
                                                    <span className="body">
                                                        This Agreement, or the rights granted hereunder, may not be assigned, sold, leased or otherwise transferred in whole or part by You. Should this Agreement, or the rights granted hereunder, by assigned, sold, leased or otherwise transferred by the Company, the rights and liabilities of the Company will bind and inure to any assignees, administrators, successors, and executors.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        SEVERABILITY:&nbsp;
                                                    </span>
                                                    <span className="body">
                                                        If any part or sub-part of this Agreement is held invalid or unenforceable by a court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to the maximum extent possible. In such condition, the remainder of this Agreement shall continue in full force.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        NO WAIVER:&nbsp; 
                                                    </span>
                                                    <span className="body">
                                                        In the event that We fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or of any other provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        HEADINGS FOR CONVENIENCE ONLY:&nbsp; 
                                                    </span>
                                                    <span className="body">
                                                        Headings of parts and sub-parts under this Agreement are for convenience and organization, only. Headings shall not affect the meaning of any provisions of this Agreement.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        NO AGENCY, PARTNERSHIP OR JOINT VENTURE: &nbsp;
                                                    </span>
                                                    <span className="body">
                                                        No agency, partnership, or joint venture has been created between the Parties as a result of this Agreement. No Party has any authority to bind the other to third parties.
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="head">
                                                        FORCE MAJEURE:&nbsp;
                                                    </span>
                                                    <span className="body">
                                                         The Company is not liable for any failure to perform due to causes beyond its reasonable control including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts which may be due to unforeseen circumstances.
                                                    </span>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ninteenth */}


                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
    
}

export default Terms;