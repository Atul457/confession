import { useState, useEffect } from "react";
import { fetchData } from "../../commonApi";
import DataTable from "react-data-table-component";
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'

export const GetUsersData = () => {

    const [adminDetails] = useState(() => {
        let details = localStorage.getItem("adminDetails");
        details = JSON.parse(details);
        return details;
    })

    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);   // ARE USERS LOADING
    const [resetSearch, setResetSearch] = useState(false);

    // CALL THE API WHENEVER THE PAGE, SHOW SELECT, OF SEARCH VALUE CHANGES
    useEffect(() => {
        getUserList();
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
            pageCount={Math.ceil(usersCount / noOfRowsPerPage) || 1}z
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
            selector: row => row.id, name: "Id", sortable: true, maxWidth: "10px",
        },
        {
            selector: row => (row.name), name: "Name", sortable: true
        },
        {
            selector: row => row.email, name: "Email", sortable: true
        },
        {
            selector: row => [row.source === 2 ? "Gmail id" : row.source === 3 ? "Facebook id" : "Manual"], name: "Login Type", sortable: true
        },
        {
            selector: row => row.post_as_anonymous === 1 ? "Yes" : "No", name: "Post As Anonymous",
        },
        {
            name: "Status",
            cell: (row) => row.status === 1 ?
                <button className="btn btn-success mx-auto pl-1 btn-sm w-100" onClick={(e) => handleAction(row.id, row.status, e.target)}>Active</button> :
                <button className="btn btn-danger mx-auto pl-1 btn-sm w-100" onClick={(e) => handleAction(row.id, row.status, e.target)}>InActive</button>,
            button: true,
            allowOverflow: true,
        },
    ]


    const handleAction = async (id, status, target) => {
        target.setAttribute("disabled", true);

        let data = {
            id: id,
            status: parseInt(status) === 1 ? 2 : 1
        }

        let obj = {
            data: data,
            token: adminDetails.token,
            method: "post",
            url: "admin/updateuserstatus"
        }
        try {
            const res = await fetchData(obj)
            if (res.data.status === true) {
                let arr = users.map((current) => {
                    if (current.id === parseInt(id)) {
                        return {
                            ...current,
                            status: data.status
                        }
                    } else {
                        return current
                    }
                })

                setUsers(arr);
            }
        } catch (err) {
            console.log(err);
        }
        target.removeAttribute("disabled");

    }

    const getUserList = async () => {
        let obj = {
            data: { page: (page + 1), perpage: noOfRowsPerPage, searchvalue: searchValue },
            token: adminDetails.token,
            method: "post",
            url: "admin/getusers"
        }
        try {
            setIsLoading((prevState) => !prevState);
            const res = await fetchData(obj)
                .then((res) => {
                    if (res.data.status === true) {
                        setUsersCount(res.data.filtercount);
                        setUsers(res.data.users);
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
        </div>
    )

}






