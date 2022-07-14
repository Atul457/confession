import './App.css';
import './css/style.css';
import Feed from "../src/user/pageElements/pages/home/Feed";
import Login from "../src/user/pageElements/pages/auth/Login";
import Register from "../src/user/pageElements/pages/auth/Register";
import CreatePost from "../src/user/pageElements/pages/create/CreatePost";
import Chat from "../src/user/pageElements/pages/chat/Chat";
import Report from "../src/user/pageElements/pages/report/Report";
import Profile from "../src/user/pageElements/pages/profile/Profile";
import AddNewFriends from "./user/pageElements/components/AddNewFriends";
import RequestsGot from "../src/user/pageElements/pages/requests/RequestsGot";
import CommentsGot from "../src/user/pageElements/pages/comments/CommentsGot";
import AdminCommentsGot from './admin/pageElements/CommentsGot';
import SiteLoader from "./user/pageElements/components/SiteLoader";
import AdminLogin from './admin/pageElements/Login';
import React, { useState, useEffect } from 'react';
import auth from './user/behindScenes/Auth/AuthCheck';
import UserProfile from '../src/user/pageElements/pages/profile/UserProfile';
import Privacy from '../src/user/pageElements/pages/privacyPolicy/Privacy';
import Dashboard from './admin/pageElements/Dashboard';
import { fetchData } from './commonApi';
import { Users } from './admin/pageElements/Users';
import { BrowserRouter as Router, Routes as Switch, Route, } from "react-router-dom";
import { ReportedUsers } from './admin/pageElements/ReportedUsers';
import { Complaints } from './admin/pageElements/Complaints';
import FbLogin from './user/pageElements/components/FbLogin';
import TagManager from 'react-gtm-module'
import VerifyEmail from './user/pageElements/components/VerifyEmail';
import Terms from './user/pageElements/pages/terms';
import CookiePolicy from './user/pageElements/pages/cookie';
import Recapv3 from './user/pageElements/components/Recapv3';
import AuthCheck from "./user/behindScenes/Auth/AuthCheck"
import ReactPixel from 'react-facebook-pixel';
import ProtectedRoute from './user/ProtectedRoute';
import getIP from './helpers/getIP';
import ResetPassword from './user/pageElements/pages/resetPassword/ResetPassword';
import { Navigate } from 'react-router-dom';


//GOOGLE TAG MANAGER
const tagManagerArgs = { gtmId: 'GTM-WP65TWC' }  //DEV
// const tagManagerArgs = { gtmId: 'GTM-KKNFBVT' }  //LIVE
TagManager.initialize(tagManagerArgs);

//META-PIXEL	
// const options = { autoConfig: true, debug: false, };
// ReactPixel.init('1638738963149766', null, options);
// ReactPixel.fbq('track', 'PageView');

getIP()

function App() {

  window.dataLayer.push({
    event: 'pageview'
  });

  const [categories, setCategories] = useState(false);
  const [categoriesResults, setCategoriesResults] = useState(true);
  const [userDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');

  useEffect(() => {
    auth();
    var token = "";
    if (userDetails) {
      token = userDetails.token;
    }
    async function getData() {
      let obj = {
        data: {},
        token: token,
        method: "get",
        url: "getcategories"
      }
      try {
        const res = await fetchData(obj)
        if (res.data.status === true) {
          setCategories(res.data.categories);
        } else {
          setCategories(false);   //HANDLES APP IN CASE OF NO API RESPONSE
        }
      } catch (err) {
        setCategories(false);
        setCategoriesResults(false);
        console.log(err);
      }
    }
    getData();

    const getProfileData = async () => {
      if (AuthCheck()) {
        let obj = {
          data: {},
          token: token,
          method: "get",
          url: "getprofile"
        }
        try {
          const res = await fetchData(obj)
          if (res.data.status === true) {
            if (userDetails !== '') {
              let freshUserDetails = { ...userDetails, profile: res.data.user };
              localStorage.setItem("userDetails", JSON.stringify(freshUserDetails))
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    getProfileData();

    //LOAD RECAPTCHA V3
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    }

    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=6LcFvPEfAAAAAL7pDU8PGSIvTJfysBDrXlBRMWgt`, function () {
      console.log("V3 loaded!");
    })
    //END OF LOAD RECAPTCHA V3

  }, [])


  const ProtectedRouteLogin = ({ children, isLoggedIn }) => {
    if (isLoggedIn)
      return <Navigate to="/home" />

    return children
  }


  return (
    <>
      {categories ?
        <Router>
          <Switch>

            {/* ADMIN ROUTES */}
            <Route path="talkplacepanel" element={<AdminLogin />} />

            {/* DASHBOARD */}
            <Route path="dashboard" element={<Dashboard categories={categories} />} />
            {/* DASHBOARD */}

            {/* COMMENTS */}
            <Route path="dashboard/confession/:postId" element={<AdminCommentsGot />} />
            {/* COMMENTS */}

            {/* USERS */}
            <Route path="admin/users" element={<Users />} />
            {/* USERS */}

            {/* REPORTED USERS */}
            <Route path="admin/reported" element={<ReportedUsers />} />
            {/* REPORTED USERS */}

            {/* COMPLAINTS */}
            <Route path="admin/complaints" element={<Complaints />} />
            {/* COMPLAINTS */}

            {/* ADMIN ROUTES */}



            {/* USER ROUTES */}

            {/* ADMOB PAGE */}
            {/* <Route path="admob" element={<AdMob />}>
            </Route> */}
            {/* ADMOB PAGE */}


            {/* FBLOGIN PAGE */}
            <Route path="fblogin" element={<FbLogin />}>
            </Route>
            {/* FBLOGIN PAGE */}


            {/* PROFILE PAGE OF OTHERS*/}
            <Route path="userProfile/:userId" element={<UserProfile />}>
            </Route>
            {/* PROFILE PAGE OF OTHERS*/}


            {/* REDIRECT PAGE IF NOT FOUND*/}
            <Route path="*" element={<Feed categories={categories} />}>
            </Route>
            {/* REDIRECT PAGE IF NOT FOUND*/}


            {/* PRIVACY PAGE */}
            <Route path="privacy" element={<Privacy />}>
            </Route>
            {/* PRIVACY PAGE */}


            {/* PRIVACY PAGE */}
            <Route path="recap" element={<Recapv3 />}>
            </Route>
            {/* PRIVACY PAGE */}


            {/* TERMS PAGE */}
            <Route path="terms" element={<Terms />}>
            </Route>
            {/* TERMS PAGE */}


            {/* Cookie Policy PAGE */}
            <Route path="cookie" element={<CookiePolicy />}>
            </Route>
            {/* Cookie Policy PAGE */}


            {/* FEED PAGE */}
            <Route path="home" element={<Feed categories={categories} />}>
            </Route>
            {/* FEED PAGE */}


            {/* PROFILE PAGE */}
            <Route path="profile" element={<Profile />}>
            </Route>
            {/* PROFILE PAGE */}


            {/* CHAT PAGE */}
            <Route path="chat" element={<Chat />}>
              <Route index element={<Chat />} />
              <Route path=":chatterId" element={<Chat />} />
            </Route>
            {/* CHAT PAGE */}


            {/* REPORT PAGE */}
            <Route path="report" element={<Report />}>
            </Route>
            {/* REPORT PAGE */}


            {/* CREATEPOST PAGE */}
            <Route path="createPost" element={<CreatePost categories={categories} />}>
            </Route>
            {/* CREATEPOST PAGE */}


            {/* LOGIN PAGE */}
            <Route path="login" element={<ProtectedRouteLogin isLoggedIn={auth()}><Login /></ProtectedRouteLogin>}>
              {/* <Route index element={<Login />} /> */}
            </Route>
            {/* LOGIN PAGE */}


            {/* VERIFYEMAIL PAGE */}
            <Route path="verifyemail/:userId/:token" element={<VerifyEmail />}>
            </Route>
            {/* VERIFYEMAIL PAGE */}


            {/* RESETPASSWORD PAGE */}
            <Route path="resetpassword/:userId/:token" element={<ResetPassword />}>
            </Route>
            {/* RESETPASSWORD PAGE */}


            {/* REGISTER PAGE */}
            <Route path="register" element={<Register />}>
            </Route>
            {/* REGISTER PAGE */}


            {/* ADDNEWFRIENDS PAGE */}
            <Route path="addfriends" element={<AddNewFriends />}>
            </Route>
            {/* ADDNEWFRIENDS PAGE */}


            {/* MESSAGES PAGE */}
            {/* <Route path="messages" element={<Messages />}>
            </Route> */}
            {/* MESSAGES PAGE */}


            {/* REQUESTSGOT PAGE */}
            <Route path="requests" element={<ProtectedRoute><RequestsGot /></ProtectedRoute>}>
              <Route index element={<RequestsGot />} />
            </Route>
            {/* REQUESTSGOT PAGE */}


            {/* COMMENTSGOT PAGE */}
            <Route path="confession/:postId" element={<CommentsGot categories={categories} />}>
            </Route>
            {/* COMMENTSGOT PAGE */}

            {/* USER ROUTES */}

          </Switch>
        </Router>
        :
        (
          categoriesResults ?
            <SiteLoader /> :
            (<div className="alert alert-danger" role="alert">
              Server Error... Please try again
            </div>)
        )}
    </>
  );
}



export default App;


