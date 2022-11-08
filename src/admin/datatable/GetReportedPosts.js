import { useState, useEffect } from "react";
import { fetchData } from "../../commonApi";
import DataTable from "react-data-table-component";
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import { useDispatch, useSelector } from "react-redux";
import { getAdminToken } from "../../helpers/getToken";
import { togglePRBModal } from "../../redux/actions/postReportedBy";
import PostReportedByModal from "../pageElements/modals/PostReportedByModal";


export const GetReportedPostsData = () => {

    const [adminDetails] = useState(() => {
        let details = localStorage.getItem("adminDetails");
        details = JSON.parse(details);
        return details;
    })

    const postRBYModalReducer = useSelector(state => state.postRBYModalReducer)
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();
    const [usersCount, setUsersCount] = useState(0);
    const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(5);
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);   // ARE USERS LOADING
    const [resetSearch, setResetSearch] = useState(false);

    // CALL THE API WHENEVER THE PAGE, SHOW SELECT, OF SEARCH VALUE CHANGES
    useEffect(() => {
        getRortedPostsList();
    }, [page, noOfRowsPerPage, searchValue])


    //SETS PAGE TO FIRST PAGE WHEN THE SEARCH VALUE CHANGES AND ITS LENGTH IS GREATED THE 0
    useEffect(() => {
        if (searchValue.length > 0) {
            setResetSearch(true);
            setPage(0);
        } else {
            setResetSearch(false);
        }
    }, [searchValue])


    // CHAGES THE CURRENT PAGE
    const handlePagination = page => {
        setPage(page.selected)
    }

    // RESETS THE CURRENT SEARCH VALUE
    const resetSearchValue = () => {
        setSearchValue("");
        setResetSearch(false);
    }

    // CUSTOM PAGINATION
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel={<i className="fa fa-chevron-left" aria-hidden="true"></i>}
            nextLabel={<i className="fa fa-chevron-right" aria-hidden="true"></i>}
            forcePage={page}
            onPageChange={page => handlePagination(page)}
            pageCount={Math.ceil(usersCount / noOfRowsPerPage) || 1}
            breakLabel={'...'}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'}
        />
    )


    const handleShowRowsPerPage = (data) => {
        setNoOfRowsPerPage(data);
        let totalPage = Math.ceil(usersCount / data);
        if (page + 1 > totalPage) {
            setPage(totalPage - 1);
        }
    }

    const columns = [
        {
            selector: row => row.description, name: "Reported Post", sortable: true, minWidth: "350px", maxWidth: "500px",
        },
        {
            selector: row => (row.count), name: "Report's Count", sortable: true
        },
        {
            name: "Post Reported By",
            cell: row => {
                return <span onClick={() => openReportedByModal(row.confession_id, row.comment_id)} className="viewReportedComment">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                </span>
            }
        },
        {
            name: "Reported on",
            cell: row => {
                return <span onClick={() => openReportedByModal(row.confession_id, row.comment_id)} className="viewReportedComment">
                    <i className="fa fa-eye" aria-hidden="true"></i>
                </span>
            }
        },
        {
            name: "Action",
            width: "150px",
            cell: (row) => <button className="btn btn-danger mx-auto pl-1 btn-sm w-100" onClick={() => deletePostFunc(row.confession_id)}>Delete post</button>,
            button: true,
            allowOverflow: true
        }
    ]


    const openReportedByModal = async (confession_id) => {
        dispatch(togglePRBModal({
            visible: true,
            data: {
                confession_id
            }
        }))
    }

    const deletePostFunc = async (confession_id) => {

        let confirm = window.confirm("Are you sure, you want to delete this post?")
        if (!confirm) return
        let confessionId = confession_id;

        let obj = {
            data: {},
            token: getAdminToken(),
            method: "get",
            url: `admin/deleteconfession/${confessionId}`,
        }

        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                getRortedPostsList()
            }
        } catch (error) {
            console.log(error);
        }

    }

    const getRortedPostsList = async () => {
        let obj = {
            data: { page: (page + 1), perpage: noOfRowsPerPage, searchvalue: searchValue },
            token: adminDetails.token,
            method: "post",
            url: "admin/getreportedconfession"
        }
        try {
            setIsLoading((prevState) => !prevState);
            const res = await fetchData(obj)
                .then((res) => {
                    if (res.data.status === true) {
                        setUsersCount(res.data.filtercount);
                        setUsers(res.data.reports);
                    }
                    setIsLoading((prevState) => !prevState);
                })
        }
        catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    }


    //CUSTOM DATATABLE STYLES
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#2E4C6D",
                color: "#fff",
                fontWeight: "bold"
            },
        },
        rows: {
            style: {
                minHeight: '40px',
            },
        },
    };


    return (
        <div>
            <div className="dataTableSelectNsearchCont">
                <div className="selectNlabelContDatatable">
                    <span className="showLabel">Show</span>
                    <select value={noOfRowsPerPage} onChange={(e) => handleShowRowsPerPage(e.target.value)} className="datatableSelect customFormControl">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="datatableSearch">
                    <label className="showLabel">
                        Search:
                    </label>
                    <div className="crossIconNinputCont">
                        <input type="text" className="customFormControl dataTableSearchInput" value={searchValue} onChange={(e) => {
                            setSearchValue(e.target.value)
                        }} />
                        {/* GETS VISIBLE ON SEARCH LENGTH MORE THAN 0 */}
                        {resetSearch === true && <i className="crossIcon fa fa-times" aria-hidden="true" type="button" onClick={() => { setPage(0); resetSearchValue() }}></i>}
                    </div>
                </div>


            </div>
            {isLoading === true ?
                <>
                    {users.length === 0 ? <h6 className="endListMessage mt-3 pb-0">No Records to show</h6> :
                        <DataTable
                            columns={columns}
                            data={users}
                            highlightOnHover
                            pagination
                            paginationPerPage={noOfRowsPerPage}
                            onChangeRowsPerPage={(currentRowsPerPage) => {
                                setNoOfRowsPerPage(currentRowsPerPage);
                            }}
                            sortIcon={<ChevronDown size={10} />}
                            customStyles={customStyles}
                            paginationDefaultPage={page + 1}
                            paginationComponent={CustomPagination}
                        />}
                </>
                : <div className="my-3 text-center">
                    <div className="spinner-border pColor" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}

            {postRBYModalReducer.visible &&
                <PostReportedByModal />}

        </div>
    )

}