import React, { useState, useEffect } from 'react';
import twoPersonIcon from '../../images/twoPersonIcon.png';
import userIcon from '../../images/userBlack.png';
import userIconI from '../../images/userGray.png';
import lockIconI from '../../images/lockOGray.png';
import lockIcon from '../../images/lockOBlue.png';
import Header from "./common/Header";
import Footer from "./common/Footer";
import auth from '../behindScenes/Auth/AuthCheck';
import { useNavigate } from "react-router-dom";
import SiteLoader from '../../user/pageElements/components/SiteLoader';
import LgSidebar from "../../user/pageElements/components/common/LgSidebar";
import SetAuth from '../behindScenes/Auth/SetAuth';
import { fetchData } from '../../commonApi';


export default function Login(props) {

    let history = useNavigate();
    const [authenticated, setAuthenticated] = useState(auth());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (auth()) {
            history("/dashboard");
        }
    }, [authenticated, history])


    async function validateForm() {
        let loginResponseCont = document.getElementById('loginResponseCont');
        let loginEmail = document.getElementById('loginEmail');
        let loginPassword = document.getElementById('loginPassword');
        let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        loginResponseCont.innerHTML = "";

        if (email.trim() === '') {
            loginEmail.innerHTML = 'This is a required field.';
            return false;
        } else if (!regex.test(email.trim())) {
            loginEmail.innerHTML = 'Please enter a valid email';
            return false;
        } else {
            loginEmail.innerHTML = '';
        }
        if (password.trim() === '') {
            loginPassword.innerHTML = 'This is a required field.';
            return false;
        }
        else {
            setIsLoading(true);
            loginEmail.innerHTML = '';
            loginPassword.innerHTML = '';

            let registerFromData = {
                "email": email,
                "password": password
            };


            let obj = {
                data: registerFromData,
                token: "",
                method: "post",
                url: "admin/login"
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    loginResponseCont.innerHTML = "";
                    setErrorOrSuccess(true);
                    localStorage.setItem("adminDetails", JSON.stringify(res.data.body));
                    localStorage.removeItem("userDetails");
                    localStorage.removeItem("authenticated");
                    SetAuth(1);
                    setAuthenticated(1);
                } else {
                    setErrorOrSuccess(false);
                    setAuthenticated(false);
                    loginResponseCont.innerHTML = res.data.message;
                }
                setIsLoading(false);
            } catch {
                setErrorOrSuccess(false);
                setIsLoading(false);
                loginResponseCont.innerHTML = "Server Error, Please try again after some time...";
            }
        }
    }


    return (
        <div className="container-fluid">
            {
                !authenticated
                    ?
                    (<div className="row">

                        {/* Adds Header Component */}
                        <Header/>

                        <div className="preventHeader">preventHead</div>
                        <div className="container py-md-4 p-3 preventFooter">
                            <div className="row py-md-2 py-0 loginPageBoxShadow boxShadow">
                                <div className="col-12 col-md-6 loginPageLeftOuterCont loginPageLeftOuterContAdmin">
                                    <div className="container-fluid pb-4">
                                        <div className="col-9 mx-auto">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="confesstText text-center">
                                                        Admin Login
                                                    </div>
                                                </div>
                                                <div className="col-12 loginInfoCont">
                                                    Login with your account to Manage confessions, manage categories,
                                                    manage reported post...
                                                </div>
                                                <div className="col-12">
                                                    <div className="confessImgCont">
                                                        <img src={twoPersonIcon} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 px-0">
                                    <div className="container-fluid rightMainFormCont">

                                        {/* Login form */}
                                        <form className="col-md-8 col-12 px-0" id="loginForm">
                                            <div className="secCheckText">Login to proceed</div>
                                            <div className="form-group">
                                                <label htmlFor="userName" className="loginPageFields">Email</label>
                                                <div className="refreshBtnDiv loginEmailField">
                                                    <input type="email" className="form-control" name="email" value={email} id="userName" placeholder="e,g. JohDoe123" onChange={(e) => setEmail(e.target.value)} />
                                                    <span className="fieldIcon">
                                                        <img src={userIcon} alt="" className="blueIcon" />
                                                        <img src={userIconI} alt="" className="grayIcon" />
                                                    </span>

                                                </div>
                                                <div className="errorCont" id="loginEmail"></div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password" className="loginPageFields">Password</label>
                                                <div className="refreshBtnDiv loginPassField">
                                                    <input type="password" name="password" className="form-control" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                    <span className="fieldIcon">
                                                        <img src={lockIcon} alt="" className="blueIcon" />
                                                        <img src={lockIconI} alt="" className="grayIcon" />
                                                    </span>
                                                </div>
                                                <div className="errorCont" id="loginPassword"></div>
                                            </div>

                                            <button type="button" className="btn submitButton" onClick={() => validateForm()}>{isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Submit"}</button>


                                            <div className={`responseCont ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="loginResponseCont"></div>

                                        </form>
                                        {/* End of Login form */}

                                    </div>
                                </div>
                            </div>
                        </div>

                        <Footer />
                    </div>)
                    : <SiteLoader />
            }

        </div>
    );
}
