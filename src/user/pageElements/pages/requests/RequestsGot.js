import React, { useState, useEffect } from 'react';
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Requests from '../../components/Requests';
import SiteLoader from '../../components/SiteLoader';
import { useNavigate } from "react-router-dom";
import auth from '../../../behindScenes/Auth/AuthCheck';
import userIcon from '../../../../images/userAcc.png';
import { fetchData } from '../../../../commonApi';
import InfiniteScroll from 'react-infinite-scroll-component';


export default function RequestsGot() {

    let history = useNavigate();
    let token;

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        if (!auth()) {
            history("/login");
        }
    }, [history])

    if (auth()) {
        token = JSON.parse(localStorage.getItem("userDetails"));
        token = token.token;
    }

    const [myRequests, setMyRequests] = useState({
        isLoading: true,
        requests: {},
        isError: false,
        message: "",
        configData: {
            token: token
        }
    });
    const [requestPage, setRequestPage] = useState(1);
    const [requestCount, setRequestCount] = useState(0);


    const getRequests = async (page = 1, append = false) => {

        let pageNo = page;

        let obj = {
            data: { page: requestPage },
            token: myRequests.configData.token,
            method: "post",
            url: "getfriendrequests"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {


                if (append === true) {
                    let newConf = [...myRequests.requests, ...res.data.requests];
                    setMyRequests({
                        ...myRequests,
                        "isLoading": false,
                        "isError": false,
                        "requests": newConf
                    });

                    setRequestPage(pageNo);
                } else {
                    setMyRequests({
                        ...myRequests,
                        "isLoading": false,
                        "isError": false,
                        "requests": res.data.requests
                    });

                    setRequestCount(res.data.count);
                }

            } else {
                setMyRequests({
                    ...myRequests,
                    "isLoading": false,
                    "isError": false,
                    "message": res.message
                });
            }
        } catch {
            setMyRequests({
                ...myRequests,
                "isLoading": false,
                "isError": true
            });
        }
    }

    const fetchMoreRequests = () => {
        getRequests((requestPage + 1), true);
    }


    //GET FRIEND REQUESTS
    useEffect(() => {
        getRequests();
    }, [])


    //ACCEPTS OR REJECTS REQUEST
    const updateFriendCount = async (status, request_id) => {

        let data = {
            request_id: request_id,
            status: status
        }

        let obj = {
            data: data,
            token: myRequests.configData.token,
            method: "post",
            url: "updatefriendrequeststatus"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                getRequests();
                history("/chat");
            } else {
                // console.log(res);
            }
        } catch {
            console.log("Some error occured");
        }
    }


    return (
        <>
            {
                !myRequests.isLoading
                    ?
                    <div className="container-fluid">
                        <div className="row">

                            {/* Adds Header Component */}
                            <Header links={true} fullWidth={true}/>

                            <div className="preventHeader">preventHead</div>
                            <div className="container py-md-4 p-3 preventFooter">
                                <div className="thoughtsNrequestsContAddFr container-fluid">
                                    <div className="row w-100">
                                        <div className="col-12 px-0">

                                            <div className="addFriendsCont">
                                                <div className="addFriendsTitle mt-2">
                                                    Friend Requests
                                                </div>

                                                <InfiniteScroll
                                                    endMessage={<div className="endListMessage text-center mt-4 pb-3">End of Requests</div>}
                                                    dataLength={(myRequests.requests).length}
                                                    next={fetchMoreRequests}
                                                    hasMore={(myRequests.requests).length < requestCount}
                                                    loader={
                                                        <div className="w-100 text-center">
                                                            <div className="spinner-border pColor mt-4" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    {/* Requesters Component */}
                                                    {(myRequests.requests).map((requester, index) => {
                                                        return <Requests updateFriendCount={updateFriendCount} request_id={requester.request_id} key={`${index}${requester.image}${requester.name}${requester.no_of_confessions}`} imgUrl={requester.image === '' ? userIcon : requester.image} requesterName={requester.name} requestersTotalSharedConf={requester.no_of_confessions} />
                                                    })}

                                                    {/* Requesters Component */}
                                                </InfiniteScroll>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Footer />
                        </div>
                    </div>
                    :
                    <SiteLoader />
            }
        </>
    )
}
