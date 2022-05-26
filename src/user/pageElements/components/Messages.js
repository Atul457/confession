import React from 'react'
import forwardIcon from '../images/forwardIcon.png';
import chatterImg from '../images/chatterImg.png';
import Header from '../pageElements/Header';
import Footer from '../pageElements/Footer';


export default function Messages() {

    return (
        <div className="container-fluid">
            <div className="row">
                <Header links={true} />
                
                <div className="preventHeader">preventHead</div>
                <div className=" container py-md-4 py-0 px-0 overFlowHidden preventFooter">
                    <div className="row px-3 py-1">

                        <div className="col-lg-12 chattingWithCont">
                            <div className="middleContMainDivChat">
                                <div className="forBottomBorder">
                                    <div className="col-12 imgNopenUserNameWrap">
                                        <img src={chatterImg} alt="" className="userImageContChat" />
                                        <div className="chatterUserName">
                                            Savannah Nguyen
                                            <span className="status">Online</span>
                                        </div>
                                        <button>...</button>
                                    </div>

                                </div>
                            </div>

                            <div style={{ height: "50px" }}>preventHead</div>
                            <div className="messagesCont pt-2">
                                <div className="messageTo">
                                    <div className="actualMessage">
                                        illum nam, aperiam est, dignissimos numquam ea
                                        <span className="messagedAt">12:34 AM</span>
                                    </div>
                                </div>

                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        <span className="messagedAt">12:38 AM</span>
                                    </div>
                                </div>



                                <div className="messageTo">
                                    <div className="actualMessage">
                                        illum nam, aperiam est, dignissimos numquam ea  Dolor
                                        <span className="messagedAt">12:40 AM</span>
                                    </div>
                                </div>

                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet consectetur
                                        <span className="messagedAt">12:46 AM</span>
                                    </div>
                                </div>

                                <div className="messageTo">
                                    <div className="actualMessage">
                                        illum nam, aperiam est, dignissimos numquam ea
                                        <span className="messagedAt">12:48 AM</span>
                                    </div>
                                </div>

                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet  elit. Quasi itaque
                                        <span className="messagedAt">12:50 AM</span>
                                    </div>
                                </div>
                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet  elit. Quasi itaque
                                        <span className="messagedAt">12:50 AM</span>
                                    </div>
                                </div>
                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet  elit. Quasi itaque
                                        <span className="messagedAt">12:50 AM</span>
                                    </div>
                                </div>
                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet  elit. Quasi itaque
                                        <span className="messagedAt">12:50 AM</span>
                                    </div>
                                </div>
                                <div className="messageFrom">
                                    <div className="actualMessage">
                                        Lorem ipsum dolor sit amet  elit. Quasi itaque
                                        <span className="messagedAt">12:50 AM</span>
                                    </div>
                                </div>



                            </div>
                            {/* MessageBox */}
                            <div className="container-fluid inputWithForwardCont"><div className="col-10 inputToAddComment">
                                <input type="text" className="form-control my-3" placeholder="Enter your message here........." />
                            </div>
                                <div className="col-2">
                                    <img src={forwardIcon} alt="" className="forwardIconContImg" />
                                </div>
                            </div>
                            {/* MessageBox */}

                        </div>

                    </div>
                </div>

                <Footer/>
            </div>
        </div>
    )
}
