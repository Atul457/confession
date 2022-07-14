import React, { useState, useEffect } from 'react';
import googleIconM from '../../../../images/googleIcon.svg';
import { Link } from "react-router-dom";
import auth from '../../../behindScenes/Auth/AuthCheck';
import SetAuth from '../../../behindScenes/SetAuth';
import { useNavigate } from "react-router-dom";
import SiteLoader from '../../components/SiteLoader';
import PrivacyModal from '../../Modals/PrivacyModal';
import { fetchData } from '../../../../commonApi';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import logo from '../../../../images/appLogo.svg';
import registerLogo from '../../../../images/registerLogo.svg';
import googleIcon from '../../../../images/googleIcon.png';
import fbIcon from '../../../../images/fbIcon.png';
import LgSidebar from '../../components/common/LgSidebar';
import useFeaturesModal from '../../../utilities/useFeaturesModal';


export default function Register() {

    let history = useNavigate();
    const [authenticated, setAuthenticated] = useState(auth());
    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [source, setSource] = useState(1);
    const [sourceId, setSourceId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rPassword, setRPassword] = useState("");
    const [errorOrSuccess, setErrorOrSuccess] = useState(true);
    const [closeFeatures, openFeatures, Features, featuresState, enableShown] = useFeaturesModal();
    // console.log(enableShown);

    //GETS THE DATA FROM THE GOOGLE LOGIN API, 
    //AND CHECKS WHETHER THE USER IS REGISTERED OR NOT
    const responseGoogle = async (data) => {

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
                    if (res.data.is_registered === 1)  //USER IS REGISTERED, LOGINS THE USER
                    {
                        localStorage.setItem("userDetails", JSON.stringify(res.data.body));
                        setAuthenticated(1);
                        SetAuth(1);
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
                        registerUserWithSocial(profileData);
                    } else if (res.data.message !== '') {
                        let profileResponseCont = document.getElementById('profileResponseCont');
                        profileResponseCont.innerText = res.data.message;
                    } else {
                        console.log(res);
                    }
                }
                setIsLoading(false);
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
        setDisplayName(profileData.name)
        setEmail(profileData.email);
        setSourceId(profileData.googleId);
        setSource(2);
        setPassword("");
        validateForm(true);
    }


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
            validateForm(true);
        }
    }, [privacyModal.accepted, featuresState.shown])

    // END OF PRIVACY MODAL


    useEffect(() => {
        if (auth()) {
            history("/home");
        }
    }, [authenticated, history])


    const responseFacebook = async (response) => {
        let profileResponseCont = document.getElementById('profileResponseCont');
        if (response.accessToken) {

            setIsLoading(true);

            let profileData = {
                name: response.name,
                source_id: response.id,
                source: 3
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
                        registerUserWithSocialFb(profileData);
                    } else if (res.data.message !== '') {
                        profileResponseCont.innerText = res.data.message;
                    } else {
                        console.log(res);
                    }
                }
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        } else {
            console.log(response);
        }
    }


    const registerUserWithSocialFb = (profileData) => {
        setDisplayName(profileData.name)
        setEmail("");
        setSourceId(profileData.source_id);
        setSource(3);
        setPassword("");
        validateForm(true);
    }


    //VALIDATES THE DETAILS DURING REGISTER
    async function validateForm(usingSocialLogin = false) {

        let profileResponseCont = document.getElementById('profileResponseCont');
        let regDisplayErrorCont = document.getElementById('regDisplayErrorCont');
        let regEmailErrorCont = document.getElementById('regEmailErrorCont');
        let regPasswordErrorCont = document.getElementById('regPasswordErrorCont');
        let regRPasswordErrorCont = document.getElementById('regRPasswordErrorCont');
        let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        //IF LOGIN IS BEING DONE USING SOCIAL LOGIN THEN NO VALIDATION IS DONE
        if (usingSocialLogin === false) {

            if (displayName.trim() === '') {
                regDisplayErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else if (email.trim() === '') {
                regEmailErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else if (!regex.test(email.trim())) {
                regEmailErrorCont.innerHTML = 'Please enter a valid email';
                return false;
            } else {
                regEmailErrorCont.innerHTML = '';
            }

            if (password.trim() === '') {
                regPasswordErrorCont.innerHTML = 'This is a required field.';
                return false;
            } else {
                regPasswordErrorCont.innerHTML = '';
            }

            if (rPassword.trim() === '') {
                regRPasswordErrorCont.innerHTML = 'This is a required field';
                return false;
            } else if (rPassword.trim() !== password.trim()) {
                regRPasswordErrorCont.innerHTML = 'Password and Repeat fields should be same';
                return false;
            } else {
                // console.log("hello");
            }
        }

        if (privacyModal.accepted === true) {

            // if (featuresState.shown === true) {

            setIsLoading(true);
            profileResponseCont.innerText = '';
            regEmailErrorCont.innerHTML = '';
            regPasswordErrorCont.innerHTML = '';
            regRPasswordErrorCont.innerHTML = '';
            regDisplayErrorCont.innerHTML = '';

            let registerFromData = {
                "email": email,
                "source": source,
                "password": password,
                "source_id": sourceId,
                "display_name": displayName,
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
                    history("/home", { state: { openFeatures: true } });
                } else {
                    setErrorOrSuccess(false);
                }
                setIsLoading(false);
                profileResponseCont.innerText = res.data.message;
            } catch {
                setIsLoading(false);
                setErrorOrSuccess(false);
                profileResponseCont.innerText = "Server Error, Please try again after some time...";
            }
            // } else {
            //     setPrivacyModal({ ...privacyModal, visible: true })
            // }
        } else {
            setPrivacyModal({ ...privacyModal, visible: true })
        }
    }


    return (
        <div className="container-fluid">
            {!authenticated
                ?
                <div className="row outerContWrapper">

                    {/* SIDEBAR */}
                    <LgSidebar
                        hidden={true}
                        logo={logo}
                        middleTitle="Login & Start Chatting"
                        middleTextBody="Register here & Create your account to create Confessions, comment on confession, adding friends, and to do a lot more..."
                        bottomLogo={registerLogo}
                    />

                    <div className="rightColumn">
                        <div className="container-fluid rightMainFormCont">

                            {/* Register Form */}
                            <form className="formLoginNregister">

                                <div className="secCheckText">Register Now</div>

                                <div className="logInUsingBnts">

                                    {/* BUTTONS CONTAINERS */}
                                    <div className="logInUsingInsideCont d-none d-md-flex">

                                        <GoogleLogin
                                            clientId="564992561843-f8dv45t8cb2nar979gpflgumsckm4ua3.apps.googleusercontent.com"
                                            autoLoad={false}
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
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
                                                <button onClick={renderProps.onClick}>
                                                    <img src={fbIcon} alt="" className='fbSocialIcon' />
                                                    <span className="socialBtnText">Continue with Facebook</span>
                                                </button>
                                            )}
                                            disableMobileRedirect={true}
                                            callback={responseFacebook}
                                            icon="fa-facebook" />

                                    </div>
                                    {/* END OF BUTTONS CONTAINERS */}

                                    <div className="orLoginUsingCont">
                                        <span>OR</span>
                                    </div>

                                </div>


                                <div className="form-group">
                                    <div className="refreshBtnDiv">
                                        <input type="text" id="displayName" className="form-control" placeholder="Display Name" minLength="3" value={displayName} onChange={(e) => { setDisplayName(e.target.value) }} />
                                    </div>
                                    <div className="errorCont" id="regDisplayErrorCont"></div>
                                </div>


                                <div className="form-group">
                                    <div className="refreshBtnDiv regisEmailField">
                                        <input type="email" value={email} className="form-control" id="userEmail" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                                    </div>
                                    <div className="errorCont" id="regEmailErrorCont"></div>
                                </div>


                                <div className="form-group">
                                    <div className="refreshBtnDiv loginPassField">
                                        <input type="password" className="form-control" id="regPassword" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                    </div>
                                    <div className="errorCont" id="regPasswordErrorCont"></div>
                                </div>


                                <div className="form-group">
                                    <div className="refreshBtnDiv regisRepPassField">
                                        <input type="password" className="form-control" id="resetPassword" placeholder="Repeat Password" value={rPassword} onChange={(e) => { setRPassword(e.target.value) }} />
                                    </div>
                                    <div className="errorCont" id="regRPasswordErrorCont"></div>
                                </div>

                                <button type="button" onClick={() => validateForm(false)} className="btn submitButton">{isLoading ? <div className="spinnerSizePost spinner-border text-white" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : "Register"}</button>


                                <div className={`responseCont ${errorOrSuccess ? 'text-success' : 'text-danger'}`} id="profileResponseCont"></div>


                                {/* Gets Visible in Mobiles Only */}
                                <div className="logInUsingBnts d-md-none">
                                    <div className="orLoginUsingCont py-3">
                                        <span>Or Register using</span>
                                    </div>
                                    {/* Buttons Container */}
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
                                                <button className="facebookMobIconOuter" onClick={renderProps.onClick} type="button">
                                                    <img src={fbIcon} alt="" className='fbSocialIcon' />
                                                </button>
                                            )}
                                            callback={responseFacebook}
                                            disableMobileRedirect={true}
                                            icon="fa-facebook" />
                                    </div>
                                    {/* End of Buttons Container */}

                                </div>
                                {/* Gets Visible in Mobiles Only */}


                                {/* LINK TO REGISTER COMPONENT */}
                                <Link to="/login" className="loginFooterLink">
                                    <div className="RegisterNowLinkCont">
                                        Already have an account? <span>Login Now</span>
                                    </div>
                                </Link>
                                {/* END OF LINK TO REGISTER COMPONENT */}

                            </form>
                            {/* End of Register Form */}

                        </div>


                    </div>

                    {/* PRIVACY MODAL */}
                    <PrivacyModal
                        privacyModal={privacyModal}
                        acceptPrivacy={acceptPrivacy}
                        handlePrivacyModal={handlePrivacyModal}
                        openFeatures={() => { }}
                    />
                    {/* PRIVACY MODAL */}

                    <Features visible={featuresState.visibile} closeModal={enableShown} />

                </div>
                :
                <SiteLoader />
            }
        </div>
    );
}
