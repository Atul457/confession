import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { resetCRBModal } from '../../../redux/actions/commReportedBy';
import InfiniteScroll from "react-infinite-scroll-component";
import auth from '../../behindScenes/Auth/AuthCheck';
import { fetchData } from '../../../commonApi';


const CommReportedByModal = () => {

    // Hooks
    const dispatch = useDispatch()
    const commRBYModalReducer = useSelector(state => state.commRBYModalReducer)
    const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState("");
    const isValidPost = true;
    const [reportsArr, setReportsArr] = useState([]);
    const [goDownArrow, setGoDownArrow] = useState(false);
    const [reportsCount, setReportsCount] = useState(false);
    const [reportsData, setReportsData] = useState({ page: 1 });

    // Functions

    // Close modal
    const closeModal = () => {
        dispatch(resetCRBModal())
    }

    const goUp = () => {
        document.querySelector("#commRepByUserModal").scrollTo({ top: "0px", behavior: "smooth" });
    }

    //SCROLLS TO TOP
    const handleScrollTo = () => {
        let scroll = document.querySelector("#commRepByUserModal") ?
            document.querySelector("#commRepByUserModal").scrollTop :
            0;
        if (scroll > 800) {
            setGoDownArrow(true);
        } else {
            setGoDownArrow(false);
        }
    }

    // Reported by
    const reportedBy = async (page = 1, append = false) => {
        let pageNo = page;

        let token;
        if (auth()) {
            token = localStorage.getItem("adminDetails");
            token = JSON.parse(token);
            token = token.token;
        } else {
            token = "";
        }

        let data = {
            page: pageNo,
            searchValue,
            perpage: noOfRowsPerPage
        }

        let obj = {
            data,
            token,
            method: "post",
            url: `admin/getreportedcommentusers/${commRBYModalReducer.data.confession_id
                }/${commRBYModalReducer.data.comment_id}`
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                console.log(res.data)
                if (append === true) {
                    let newConf = [...reportsArr, ...res.data.users];
                    setReportsData({ page: pageNo })
                    setReportsArr(newConf);
                } else {
                    setReportsCount(res.data.count);
                    setReportsArr(res.data.users);

                }
            }
        } catch (err) {
            console.log(err.message)
            console.log("something went wrong");
        }
    }

    useEffect(() => {
        reportedBy();
    }, [])

    useEffect(() => {
        console.log(reportsData)
    }, [reportsData])


    // Fetches more users
    const fetchMoreUser = () => {
        reportedBy((reportsData.page + 1), true);
    }

    return (
        <Modal
            show={commRBYModalReducer.visible}
            centered
            className='avatarModal'
            size={`lg`}
            onHide={closeModal}>

            <Modal.Header className='justify-content-between'>
                <h6>
                    Comment Reported By
                </h6>
                <span type="button" onClick={closeModal}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </span>
            </Modal.Header>
            <Modal.Body className="privacyBody text-center profilePicOptions">
                {isValidPost && <div className="commRepByUserModal" id="commRepByUserModal">
                    {reportsArr.length > 0
                        ?
                        <InfiniteScroll
                            className='commentsModalIscroll'
                            onScroll={handleScrollTo}
                            scrollableTarget="commRepByUserModal"
                            endMessage={
                                <div className="endListMessage mt-2 pb-0">
                                    <span
                                        className='closeBackButton'
                                        onClick={closeModal}>
                                        Go back
                                    </span>
                                </div>}
                            dataLength={reportsArr.length}
                            next={fetchMoreUser}
                            hasMore={reportsArr.length < reportsCount}
                            loader={
                                <div className="w-100 text-center">
                                    <div className="spinner-border pColor mt-4" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            }
                        >
                            <div className="singleReportUser">
                                <span className='reportComByUser head'>
                                    Reported By
                                </span>
                                <span className='reportComByUserCrDate head'>
                                    Reported Date
                                </span>
                            </div>
                            {reportsArr.map((user) => {
                                return (
                                    <div key={`${user.created_at}${user.name}`} className="singleReportUser">
                                        <span className='reportComByUser'>
                                            {user.name}
                                        </span>
                                        <span className='reportComByUserCrDate'>
                                            {user.created_at}
                                        </span>
                                    </div>)

                            })}
                        </InfiniteScroll>
                        : <div className="endListMessage m-0 pb-1">
                            End of Users
                            <span
                                className='closeBackButton'
                                onClick={closeModal}>
                                Go back
                            </span>
                        </div>}

                </div>}
            </Modal.Body>
        </Modal >
    )
}

export default CommReportedByModal