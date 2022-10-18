import React from 'react'

// React router imports
import {
    BrowserRouter as Router,
    Routes as Switch,
    Route,
    Navigate
} from "react-router-dom";


// Helpers
import auth from '../user/behindScenes/Auth/AuthCheck';

// Component imports
import Feed from "../../src/user/pageElements/pages/home/Feed";
import Login from "../../src/user/pageElements/pages/auth/Login";
import Register from "../../src/user/pageElements/pages/auth/Register";
import Chat from "../../src/user/pageElements/pages/chat/Chat";
import Report from "../../src/user/pageElements/pages/report/Report";
import Profile from "../../src/user/pageElements/pages/profile/Profile";
import AddNewFriends from "../user/pageElements/components/AddNewFriends";
import RequestsGot from "../../src/user/pageElements/pages/requests/RequestsGot";
import CommentsGot from "../../src/user/pageElements/pages/comments/CommentsGot";
import AdminCommentsGot from '../admin/pageElements/CommentsGot';
import AdminLogin from '../admin/pageElements/Login';
import UserProfile from '../../src/user/pageElements/pages/profile/UserProfile';
import Privacy from '../../src/user/pageElements/pages/privacyPolicy/Privacy';
import Dashboard from '../admin/pageElements/Dashboard';
import { Users } from '../admin/pageElements/Users';
import { ReportedUsers } from '../admin/pageElements/ReportedUsers';
import { Complaints } from '../admin/pageElements/Complaints';
import { ReportedComments } from '../admin/pageElements/ReportedComments';
import { ReportedPosts } from '../admin/pageElements/ReportedPosts';
import Forums from '../user/pageElements/pages/forums/Forums';
import FbLogin from '../user/pageElements/components/FbLogin';
import VerifyEmail from '../user/pageElements/components/VerifyEmail';
import Terms from '../user/pageElements/pages/terms';
import CookiePolicy from '../user/pageElements/pages/cookie';
import Recapv3 from '../user/pageElements/components/Recapv3';
import ProtectedRoute from '../user/ProtectedRoute';
import ResetPassword from '../user/pageElements/pages/resetPassword/ResetPassword';
import ForumDetailPage from '../user/pageElements/pages/forums/ForumDetailPage';
import Search from '../user/pageElements/pages/search/Search';


const Routes = ({ categories }) => {
    return (
        <>
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

                    {/* REPORTED COMMENTS */}
                    <Route path="admin/reportedcomments" element={<ReportedComments />} />
                    {/* REPORTED COMMENTS */}

                    {/* REPORTED COMMENTS */}
                    <Route path="admin/reportedposts" element={<ReportedPosts />} />
                    {/* REPORTED COMMENTS */}

                    {/* COMPLAINTS */}
                    <Route path="admin/complaints" element={<Complaints />} />
                    {/* COMPLAINTS */}

                    {/* ADMIN ROUTES */}



                    {/* USER ROUTES */}

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

                    {/* FORUM DETAIL PAGE */}
                    <Route path="forums/:slug"
                        element={<ProtectedRouteLogin isLoggedIn={!auth()}>
                            <ForumDetailPage />
                        </ProtectedRouteLogin>} />
                    {/* REPORT PAGE */}

                    {/* Forums PAGE */}
                    <Route path="forums"
                        element={<ProtectedRouteLogin isLoggedIn={!auth()}>
                            <Forums />
                        </ProtectedRouteLogin>} />
                    {/* Forums PAGE */}


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

                    {/* SEARCH PAGE */}
                    <Route path="search" element={<Search />}>
                    </Route>
                    {/* SEARCH PAGE */}


                    {/* MESSAGES PAGE */}
                    {/* <Route path="messages" element={<Messages />}/> */}
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
        </>
    )
}


// ProtectedRoute
const ProtectedRouteLogin = ({ children, isLoggedIn }) => {
    if (isLoggedIn)
        return <Navigate to="/home" />

    return children
}

export default Routes