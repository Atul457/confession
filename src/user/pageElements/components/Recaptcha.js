import React from 'react';
import manWithBook from '../images/manWithBoard.png';
import Header from "../pageElements/Header";

export default function Recaptcha() {
    return (
        <div className="container-fluid">
            <div className="row">
                <Header />
                <div className="container py-4">
                    <div className="row py-2">
                        <div className="col-6">
                            <div className="container-fluid">
                                <div className="col-12">
                                    <div className="confesstText">
                                        Confess or share your thoughts
                                        anonymously
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="confessImgCont">
                                        <img src={manWithBook} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="container-fluid rightMainFormCont">
                                <form className="col-8">
                                    <div className="secCheckText">One step security check</div>
                                    <div className="infoCont">
                                        I am not a robot.
                                        Enter the below text in input field. so we can save you from Spams or robots.
                                    </div>
                                    <div className="form-group refreshBtnDiv">
                                        <input type="email" className="form-control showRecapInput" id="exampleInputEmail1" placeholder="Enter Recaptcha" />
                                        <span className="refreshBtn">Refresh</span>
                                    </div>
                                    <div className="form-group enterRecapthaCont container-fluid px-0">
                                        <label htmlFor="recaptcha" className="labelStyle col-3 p-0">Enter Word</label>
                                        <input type="password" className="form-control recaptchaInput col-9" id="recaptcha" placeholder="Enter captcha text" />
                                    </div>
                                    <button type="submit" className="btn submitButton">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
