import React, { useState, useEffect, createContext } from 'react';
import TagManager from 'react-gtm-module'

// Styles
import './App.css';
import './css/style.css';
import 'react-toastify/dist/ReactToastify.css';

// Custom component imports
import SiteLoader from "./user/pageElements/components/SiteLoader";
import Routes from './routes/Routes';

// Helpers
import { fetchData } from './commonApi';
import auth from './user/behindScenes/Auth/AuthCheck';
import getIP from './helpers/getIP';
import toastMethods from './helpers/components/Toaster';
import { getCategoriesService, getTagsService } from './components/forums/services/forumServices';
import { envConfig } from './configs/envConfig';
import { apiStatus } from './helpers/status';
import { getKeyProfileLoc } from './helpers/profileHelper';

// Firebase
import { getMyToken, onMessageListener } from './configs/firebaseconfig';
import { runFbOrNot, setFCMToken, setTokenSentFlag } from './configs/firebaseToken';

// Redux
import { forumHandlers } from './redux/actions/forumsAc/forumsAc';
import { useDispatch, useSelector } from 'react-redux';

import ReactPixel from 'react-facebook-pixel';
import forumTypes from "./components/forums/forumTypes.json"

//GOOGLE TAG MANAGER
const tagManagerArgs = { gtmId: envConfig.isProdMode ? envConfig.tagManagerLiveKey : envConfig.tagManagerDevKey }
TagManager.initialize(tagManagerArgs);

//META-PIXEL	
if (envConfig.isProdMode) {
  const options = { autoConfig: true, debug: false, };
  ReactPixel.init(envConfig.pixelId, null, options);
  ReactPixel.fbq('track', 'PageView');
}

export const AuthContext = createContext(auth())

// Set the ip to localstorage by fetching it from third party
getIP()

function App() {

  window.dataLayer.push({
    event: 'pageview'
  });

  // Hooks and vars
  const [categories, setCategories] = useState(false);
  const tagsReducer = useSelector(store => store?.forumsReducer?.tags)
  const dispatch = useDispatch()
  const [toggle, setToggle] = useState(false)
  const [categoriesResults, setCategoriesResults] = useState(true);
  const [token, setToken] = useState("")
  const [userDetails, setUserDetails] = useState(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '');


  // Functions
  const setAuth = () => {
    setUserDetails(() => {
      if (auth() && userDetails !== "") return userDetails
      return auth() && userDetails === "" ? JSON.parse(localStorage.getItem("userDetails")) : ''
    })
  }

  useEffect(() => {
    // Checks the permission for notification, if is not given, asks to give.
    const getPermission = async () => {
      if (Notification.permission !== "granted")
        await Notification.requestPermission()
    }
    getPermission()
    if (auth()) getMyToken(setToken)
  }, [userDetails])

  useEffect(() => {
    // Update the device token, whenever the token changes on client side
    if (token !== "") {
      const saveDeviceId = async () => {
        let obj = {
          data: {
            "device_id": token
          },
          token: userDetails.token,
          method: "post",
          url: "updatedeviceid"
        }
        try {
          const res = await fetchData(obj)
          if (res.data.status === true) {
            setFCMToken(token)
            setTokenSentFlag(true)
          } else {
            setUserDetails(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '')
            setTokenSentFlag(false)
          }
        } catch (err) {
          setUserDetails(auth() ? JSON.parse(localStorage.getItem("userDetails")) : '')
          setTokenSentFlag(false)
          console.log(err);
        }
      }
      saveDeviceId()
    }
  }, [token])

  useEffect(() => {
    // runFbOrNot check whether firebase functions are available or not, if available, then on uses it, prevents side from being crash due to firebase
    if (auth() && runFbOrNot) {
      onMessageListener().then(payload => {
        toastMethods.info(payload.data["gcm.notification.text"] ?? "A new message arrived", payload.data)
        setToggle(!toggle)
      }).catch(err => console.log('failed cause: ', err));
    }
  }, [userDetails, toggle])

  // Retrieves the categories from the backend, and if authenticated fetches the userDetails also
  useEffect(() => {
    async function getData() {
      try {
        const res = await getCategoriesService({
          dispatch
        })
        setCategories(res.categories);
      } catch (err) {
        setCategories(false);
        setCategoriesResults(false);
        console.log(err);
      }
    }

    getTagsService({ dispatch });
    getData();

    const getProfileData = async () => {
      if (auth()) {
        let obj = {
          data: {},
          token: getKeyProfileLoc("token", true),
          method: "get",
          url: "getprofile"
        }
        try {
          const res = await fetchData(obj)
          if (res.data.status === true) {
            if (userDetails !== '') {
              let freshUserDetails = { ...userDetails, profile: { ...res.data.user, ...{ comments: res.data?.comments } } };
              localStorage.setItem("userDetails", JSON.stringify(freshUserDetails))
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    getProfileData();

    // Loads recaptcha v3
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

    loadScriptByURL("recaptcha-key", envConfig.recaptchaKey, function () {})

    // End of load recaptcha v3
    let { handleForumsTypesAcFn } = forumHandlers
    dispatch(handleForumsTypesAcFn({ data: forumTypes }))

  }, [])

  useEffect(() => {
    if (categories?.length) dispatch(forumHandlers.handleForumCatsAcFn({ data: categories }))
  }, [categories])

  return (
    <>
      <AuthContext.Provider value={setAuth}>
        {categories && tagsReducer?.status === apiStatus.FULFILLED ? <Routes categories={categories} /> :
          (
            (categoriesResults || tagsReducer?.status === apiStatus.LOADING) ? <SiteLoader /> : (
              <div className="alert alert-danger" role="alert">
                Server Error... Please try again
              </div>)
          )}
      </AuthContext.Provider>
    </>
  );
}



export default App;
