import { useState, useEffect } from "react";
import { fetchData } from "../../commonApi";
import DataTable from "react-data-table-component";
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'

export const GetReportsData = () => {

    const [adminDetails] = useState(() => {
        let details = localStorage.getItem("adminDetails");
        details = JSON.parse(details);
        return details;
    })

    const [reports, setReports] = useState([]);
    const [reportsCount, setReportsCount] = useState(0);
    const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);   // ARE USERS LOADING
    const [resetSearch, setResetSearch] = useState(false);

    // CALL THE API WHENEVER THE PAGE, SHOW SELECT, OF SEARCH VALUE CHANGES
    useEffect(() => {
        getReportList();
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
            pageCount={Math.ceil(reportsCount / noOfRowsPerPage) || 1}
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
        let totalPage = Math.ceil(reportsCount / data);
        if (page + 1 > totalPage) {
            setPage(totalPage - 1);
        }
    }

    const columns = [
        {
            selector: row => row.report_id, name: "Id", sortable: true,maxWidth: "10px",
        },
        {
            selector: row => row.by_name, name: "Reported By", sortable: true
        },
        {
            selector: row => row.to_name, name: "Reported To", sortable: true
        },
        {
            selector: row => row.reported_at, name: "Reported On", sortable: true
        },
    ]


    const getReportList = async () => {
        let obj = {
            data: { page: (page + 1), perpage: noOfRowsPerPage, searchvalue: searchValue },
            token: adminDetails.token,
            method: "post",
            url: "admin/getreportusers"
        }
        try {
            setIsLoading((prevState) => !prevState);
            const res = await fetchData(obj)
                .then((res) => {
                    if (res.data.status === true) {
                        setReportsCount(res.data.filtercount);
                        setReports(res.data.reports);
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
                    {reports.length === 0 ? <h6 className="endListMessage mt-3 pb-0">No Records to show</h6> :
                        <DataTable
                            columns={columns}
                            data={reports}
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






