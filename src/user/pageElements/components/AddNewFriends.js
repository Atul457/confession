import React from 'react';
import dpImg from '../../../images/dpImg.png';
import requestsIcon from '../../../images/requestsIcon.png';
import AddNew from './AddNew';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function AddNewFriends() {
    let addFriendsArr = [
        { imgUrl: dpImg, requesterName: 'Devon Lane', requestersTotalSharedConf: '5' },
        { imgUrl: dpImg, requesterName: 'Ronald Richards', requestersTotalSharedConf: '15' },
        { imgUrl: dpImg, requesterName: 'Jenny Wilson', requestersTotalSharedConf: '7' },
        { imgUrl: dpImg, requesterName: 'Jerome Bell', requestersTotalSharedConf: '9' }
    ];

    return (

        <div className="container-fluid">
            <div className="row">

                {/* Adds Header Component */}
                <Header links={true} />

                <div className="preventHeader">preventHead</div>
                <div className="container py-md-4 p-3 preventFooter">
                    <div className="thoughtsNrequestsContAddFr container-fluid">
                        <div className="row w-100">
                            <div className="col-12 px-0">
                                <div className="friendsRequestsMainCont">
                                    <div className="friendRequestsHeader">
                                        <span className="requestsHeaderTitle">
                                            You’ve got 10 friend requests
                                        </span>
                                        <img src={requestsIcon} alt="" className="friendRequestsHeaderImg" />
                                    </div>
                                </div>

                                <div className="addFriendsCont">
                                    <div className="addFriendsTitle mt-2 d-none d-md-block">
                                        Find New Friends
                                    </div>
                                    {/* Add New Friend Components */}
                                    <div className="requestersMainCont">
                                        {addFriendsArr.map((requester, index) => {
                                            return <AddNew key={`${index}${requester.imgUrl}${requester.requesterName}${requester.requestersTotalSharedConf}`} imgUrl={requester.imgUrl} requesterName={requester.requesterName} requestersTotalSharedConf={requester.requestersTotalSharedConf} />
                                        })}
                                    </div>
                                    {/* Add New Friend Components */}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <Footer/>
            </div>
        </div>




    )
}
