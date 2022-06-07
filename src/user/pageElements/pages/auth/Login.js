import React, { useState, useEffect } from 'react';
import loginLogo from '../../../../images/loginLogo.svg';
import googleIcon from '../../../../images/googleIcon.png';
import fbIcon from '../../../../images/fbIcon.png';
import { Link, useSearchParams } from "react-router-dom";
import auth from '../../../behindScenes/Auth/AuthCheck';
import { useNavigate, Outlet } from "react-router-dom";
import SiteLoader from '../../components/SiteLoader';
import SetAuth from '../../../behindScenes/SetAuth';
import { fetchData } from '../../../../commonApi';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import PrivacyModal from './../../Modals/PrivacyModal';
import logo from '../../../../images/appLogo.svg'
import LgSidebar from '../../components/common/LgSidebar';
import googleIconM from '../../../../images/googleIcon.svg';
import ForgotPassModal from '../../Modals/ForgotPassModal';
import { forgotUPassActionCreators } from '../../../../redux/actions/forgotUPassword';
import { useDispatch } from 'react-redux';



export default function Login() {

    let [mess] = useSearchParams();
    mess = mess.get("message");
    const dispatch = useDispatch();

    useEffect(() => {
        if (parseInt(mess) === 1) {
            let loginResponseCont = document.getElementById('loginResponseCont');
            setErrorOrSuccess(false);
            loginResponseCont.innerHTML = "Your account is currently inactive, please contact admin";
        }
    }, [mess])


    let history = useNavigate();
    const [authenticated, setAuthenticated] = useState(auth());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [source, setSource] = useState(1);
    const [sourceId, setSourceId] = useState("");

    // PRIVACY MODAL
    const [privacyModal, setPrivacyModal] = useState({
        visible: false,
        accepted: false,
    });

    const acceptPrivacy = () => {
        setPrivacyModal({ ...privacyModal, accepted: true, visible: false });
    }

    const handlePrivacyModal = () => {
        privacyModal.visible ?
            setPrivacyModal({ ...privacyModal, visible: false }) :
            setPrivacyModal({ ...privacyModal, visible: true })
    }

    useEffect(() => {
        if (privacyModal.accepted === true) {
            register();
        }
    }, [privacyModal.accepted])

    // END OF PRIVACY MODAL

    useEffect(() => {
        if (auth()) {
            history("/home");
        }
    }, [authenticated, history])


    //GETS THE DATA FROM THE GOOGLE LOGIN API, 
    //AND CHECKS WHETHER THE USER IS REGISTERED OR NOT
    const responseGoogle = async (data) => {

        let loginResponseCont = document.getElementById('loginResponseCont');
        let profileData = data.profileObj;

        if (!data.profileObj) {
            return false;
        }

        if (profileData.googleId && profileData.googleId !== '') {

            setIsLoading(true);

            let socialLoginData = {
                source_id: profileData.googleId,
                source: 2,
            }

            let obj = {
                data: socialLoginData,
                token: "",
                method: "post",
                url: "sociallogin"
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    if (res.data.is_registered === 1) //USER IS REGISTERED, LOGINS THE USER
                    {
                        localStorage.setItem("userDetails", JSON.stringify(res.data.body));
                        setAuthenticated(1);
                        SetAuth(1);
                        loginResponseCont.innerHTML = "";
                        setErrorOrSuccess(true);
                        localStorage.removeItem("adminDetails");
                        localStorage.removeItem("adminAuthenticated");
                        localStorage.setItem("privacyAccepted", 1);
                        history("/home");
                    }
                } else if (res.data.status === false) //USER IS NOT REGISTERD
                {
                    setErrorOrSuccess(prevState => !prevState === false && !prevState);
                    if (res.data.is_registered === 0)  //USER IS NOT REGISTERD, REGISTERS THE USER
                    {
                        registerUserWithSocial(profileData);
                    } else if (res.data.message !== '') {
                        loginResponseCont.innerText = res.data.message;
                    } else {
                        console.log(res);
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        } else {
            console.log(data);
        }
    }


    //SETS THE DATA GOT FROM GOOGLE LOGIN API, TO STATE VARIABLES FOR REGISTER 
    const registerUserWithSocial = async (profileData) => {
        setDisplayName(profileData.name);
        setEmail(profileData.email);
        setSourceId(profileData.googleId);
        setSource(2);
        setPassword("");
        register();
    }


    const responseFacebook = async (response) => {
        let loginResponseCont = document.getElementById('loginResponseCont');

        if (response.accessToken) {

            setIsLoading(true);

            let profileData = {
                name: response.name,
                source_id: response.id
            }

            let socialLoginData = {
                source_id: response.id,
                source: 3,
            }

            let obj = {
                data: socialLoginData,
                token: "",
                method: "post",
                url: "sociallogin"
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    if (res.data.is_registered === 1)  //USER IS REGISTERED, LOGINS THE USER
                    {
                        localStorage.setItem("userDetails", JSON.stringify(res.data.body));
                        setAuthenticated(1);
                        SetAuth(1);
                        loginResponseCont.innerHTML = "";
                        setErrorOrSuccess(true);
                        localStorage.removeItem("adminDetails");
                        localStorage.removeItem("adminAuthenticated");
                        localStorage.setItem("privacyAccepted", 1);
                        history("/home");
                    }
                } else if (res.data.status === false) {
                    setErrorOrSuccess(prevState => !prevState === false && !prevState);
                    if (res.data.is_registered === 0)  //USER IS NOT REGISTERD, REGISTERS THE USER
                    {
                        if (res.data.is_registered === 0) {
                            registerUserWithSocialFb(profileData);
                        }
                    } else if (res.data.message !== '') {
                        loginResponseCont.innerText = res.data.message;
                    } else {
                        console.log(res);
                    }
                }
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
            }
        } else {
            console.log(response);
        }
    }

    const registerUserWithSocialFb = (profileData) => {
        setDisplayName(profileData.name);
        setEmail("");
        setSourceId(profileData.source_id);
        setSource(3);
        setPassword("");
        register(true);
    }

    const register = async () => {

        let loginResponseCont = document.getElementById('loginResponseCont');
        if (privacyModal.accepted === true) {
            setIsLoading(true);
            loginResponseCont.innerText = '';

            let registerFromData = {
                "display_name": displayName,
                "email": email,
                "source": source,
                "password": password,
                "source_id": sourceId
            };

            let obj = {
                data: registerFromData,
                token: "",
                method: "post",
                url: "register"
            }

            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    setAuthenticated(true);
                    setErrorOrSuccess(true);
                    localStorage.setItem("userDetails", JSON.stringify(res.data.body));
                    SetAuth(1);
                    localStorage.removeItem("adminDetails");
                    localStorage.removeItem("adminAuthenticated");
                    history("/home");
                } else {
                    setErrorOrSuccess(false);
                }
                setIsLoading(false);
                loginResponseCont.innerText = res.data.message;
            } catch {
                setIsLoading(false);
                setErrorOrSuccess(false);
                loginResponseCont.innerText = "Server Error, Please try again after some time...";
            }
        } else {
            setPrivacyModal({ ...privacyModal, visible: true })
        }
    }


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
                "password": password,
                "source": "1",
            };


            let obj = {
                data: registerFromData,
                token: "",
                method: "post",
                url: "login"
            }
            try {
                const res = await fetchData(obj)
                if (res.data.status === true) {
                    localStorage.setItem("userDetails", JSON.stringify(res.data.body));
                    setAuthenticated(1);
                    SetAuth(1);
                    loginResponseCont.innerHTML = "";
                    setErrorOrSuccess(true);
                    localStorage.removeItem("adminDetails");
                    localStorage.removeItem("adminAuthenticated");
                    localStorage.setItem("privacyAccepted", 1);
                    history("/home");
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
                    (<div className="row outerContWrapper">

                        {/* VERIFY EMAIL MODAL COMPONENT */}
                        <Outlet />

                        {/* SIDEBAR */}
                        <LgSidebar
                            logo={logo}
                            middleTitle="Login & Start Chatting"
                            middleTextBody="Login with your account to create confession, comment on confession, add friends, and to do much more..."
                            bottomLogo={loginLogo}
                        />


                        <div className="rightColumn">
                            <div className="container-fluid rightMainFormCont">
                                {/* LOGIN FORM */}
                                <form className="formLoginNregister" id="loginForm">
                                    <div className="secCheckText">Login to proceed</div>

                                    <div className="logInUsingBnts">

                                        {/* SOCAIL WEB BUTTONS CONTAINER */}
                                        <div className="logInUsingInsideCont d-none d-md-flex">
                                            <GoogleLogin
                                                clientId="564992561843-f8dv45t8cb2nar979gpflgumsckm4ua3.apps.googleusercontent.com"
                                                autoLoad={false}
                                                render={renderProps => (
                                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} type="button">
                                                        <img src={googleIcon} alt="" className='googleSocialIcon' />
                                                        <span className="socialBtnText">Continue with Google</span>
                                                    </button>
                                                )}
                                                buttonText="Login"
                                                onSuccess={(data) => { responseGoogle(data) }}
                                                onFailure={(data) => { responseGoogle(data) }}
                                                cookiePolicy={'single_host_origin'}
                                            />


                                            <FacebookLogin
                                                appId="350064407020433"
                                                autoLoad={false}
                                                fields="name,email,picture"
                                                scope="public_profile,user_friends"
                                                componentClicked={false}
                                                render={renderProps => (
                                                    <button onClick={renderProps.onClick} type="button">
                                                        <img src={fbIcon} alt="" className='fbSocialIcon' />
                                                        <span className="socialBtnText">Continue with Facebook</span>
                                                    </button>
                                                )}
                                                callback={responseFacebook}
                                                disableMobileRedirect={true}
                                                icon="fa-facebook" />
                                        </div>
                                        {/* End of Buttons Container */}


                                        <div className="orLoginUsingCont">
                                            <span>OR</span>
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <div className="refreshBtnDiv loginEmailField">
                                            <input type="email" className="form-control" name="email" value={email} id="userName" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                                        </div>
                                        <div className="errorCont" id="loginEmail"></div>
                                    </div>

                                    <div className="form-group">
                                        <div className="refreshBtnDiv loginPassField">
                                            <input type="password" name="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
                                        </div>
                                        <div className="errorCont" id="loginPassword"></div>
                                        <div
                                            className="form-group RegisterNowLinkCont text-right"
                                            type="button"
                                            onClick={() => dispatch(forgotUPassActionCreators.openChangePassModal())}>
                                            <span>
                                                Forgot Password ?
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn submitButton"
                                        onClick={() => validateForm()}>{isLoading ? <div className="spinnerSizePost spinner-border text-white"
                                            role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Submit"}
                                    </button>


                                    <div
                                        className={`responseCont ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="loginResponseCont">
                                    </div>


                                    {/* SOCAIL MOB BUTTONS CONTAINER  */}
                                    <div className="logInUsingInsideCont socialMobileBtns mobileSocialBtns">
                                        <GoogleLogin
                                            clientId="564992561843-f8dv45t8cb2nar979gpflgumsckm4ua3.apps.googleusercontent.com"
                                            autoLoad={false}
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="googleMobIcon" type="button">
                                                    <img src={googleIconM} alt="googleIcon" className='googleSocialIcon' />
                                                </button>
                                            )}
                                            buttonText="Login"
                                            onSuccess={(data) => { responseGoogle(data) }}
                                            onFailure={(data) => { responseGoogle(data) }}
                                            cookiePolicy={'single_host_origin'}
                                        />


                                        <FacebookLogin
                                            appId="350064407020433"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            scope="public_profile,user_friends"
                                            componentClicked={false}
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} className="facebookMobIconOuter" type="button">
                                                    <img src={fbIcon} alt="" className='fbSocialIcon' />
                                                </button>
                                            )}
                                            disableMobileRedirect={true}
                                            callback={responseFacebook}
                                            icon="fa-facebook" />
                                    </div>


                                    {/* Link to register component */}
                                    <Link to="/register" className="loginFooterLink">
                                        <div className="RegisterNowLinkCont">
                                            Don’t have an account? <span>Register Now</span>
                                        </div>
                                    </Link>
                                    {/* End of Link to register component */}

                                </form>
                                {/* End of Login form */}

                            </div>
                        </div>

                        {/* PRIVACY MODAL */}
                        <PrivacyModal privacyModal={privacyModal} acceptPrivacy={acceptPrivacy} handlePrivacyModal={handlePrivacyModal} />
                        {/* PRIVACY MODAL */}

                        {/* FORGOT PASSWORD MODAL */}
                        <ForgotPassModal />
                        {/* FORGOT PASSWORD MODAL */}

                    </div>)
                    : <SiteLoader />
            }

        </div>
    );
}
