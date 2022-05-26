import { useState, useEffect } from "react";
import { fetchData } from "../../commonApi";
import DataTable from "react-data-table-component";
import ReactPaginate from 'react-paginate';
import { ChevronDown } from 'react-feather';
import Lightbox from "react-awesome-lightbox";
import Button from '@restart/ui/esm/Button';
import { Modal } from 'react-bootstrap';

export const GetComplaintsData = () => {

    const [adminDetails] = useState(() => {
        let details = localStorage.getItem("adminDetails");
        details = JSON.parse(details);
        return details;
    })

    const [complaints, setComplaints] = useState([]);
    const [complaintsCount, setComplaintsCount] = useState(0);
    const [noOfRowsPerPage, setNoOfRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);   // ARE complaints LOADING
    const [resetSearch, setResetSearch] = useState(false);
    const [image, setImage] = useState([]);
    const [complaintModal, setComplaintModal] = useState({
        isVisible: false,
        data: ""
    })

    // CLOSE COMPLAINT MODAL
    const handleComplaintModal = () => {
        setComplaintModal({ isVisible: false, data: "" });
    }

    // OPEN COMPLAINT MODAL
    const openComplaintModal = (message) => {
        setComplaintModal({ isVisible: true, data: message });
    }

    // CALL THE API WHENEVER THE PAGE, SHOW SELECT, OF SEARCH VALUE CHANGES
    useEffect(() => {
        getComplainsList();
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
            pageCount={Math.ceil(complaintsCount / noOfRowsPerPage) || 1}
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
        let totalPage = Math.ceil(complaintsCount / data);
        if (page + 1 > totalPage) {
            setPage(totalPage - 1);
        }
    }    

    const columns = [
        {
            selector: row => row.id, name: "Id", sortable: true, maxWidth: "10px",
        },
        {
            selector: row => !row.name || row.name==='' ? "Anonymous" : row.name, name: "Name", sortable: true, maxWidth: "150px",
        },
        {
            selector: row => row.related_issue, name: "Related Issue", sortable: true, minWidth: "200px",
        },
        {
            selector: (row) => <div type="button" onClick={() => { openComplaintModal(row.message) }}>{row.message}</div>, name: "Complaint", sortable: true, maxHeight: "40px", maxWidth: "300px", style: {
                "whiteSpace": "nowrap",
                "overflow": "hidden",
                "textOverflow": "ellipsis",
            }
        },
        {
            selector: (row) => row, name: "Image", minWidth: "200px",
            cell: row => (
                row.image &&
                ((row.image).length !== 0 && ((row.image).length > 0
                    &&
                    <div className="d-flex align-items-center" type="button" onClick={() => openLightBox(row.image)}>
                        {row.image.map((curr, index) => {
                            return index < 3 ? (
                                <div key={curr} className="dataTableImgCont">
                                    <img width="24px" height="24px" src={curr} alt="" className="mr-1" />
                                </div>
                            ) : (index === 4 && <span key={curr} className="moreButtonAdminComplains" onClick={() => openLightBox(row.image)}>more</span>)
                        })}
                    </div>
                )
                )
            ),
        }
    ]


    const getComplainsList = async () => {
        let obj = {
            data: { page: (page + 1), perpage: noOfRowsPerPage, searchvalue: searchValue },
            token: adminDetails.token,
            method: "post",
            url: "admin/getcomplains"
        }
        try {
            setIsLoading((prevState) => !prevState);
            const res = await fetchData(obj)
                .then((res) => {
                    if (res.data.status === true) {
                        setComplaintsCount(res.data.filtercount);
                        setComplaints(res.data.complain);
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
                fontWeight: "bold",
            },
        },
        rows: {
            style: {
                minHeight: '40px',
            },
        },
    };


    const openLightBox = (images) => {
        setImage(images);
    }


    return (
        <div>
            <>
                {(image.length > 0) &&

                    (image.length === 1) ?
                    (<Lightbox image={image[0]} onClose={() => { setImage([]) }} />)    //SINGLE IMAGE
                    :
                    (image.length > 1 &&
                        <Lightbox images={image} onClose={() => { setImage([]) }} />)     //MULTIPLE IMAGES
                }
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
                            <input type="text" className="customFormControl dataTableSearchInput dddf" value={searchValue} onChange={(e) => {
                                setSearchValue(e.target.value)
                            }} />
                            {/* GETS VISIBLE ON SEARCH LENGTH MORE THAN 0 */}
                            {resetSearch === true && <i className="crossIcon fa fa-times" aria-hidden="true" type="button" onClick={() => { setPage(0); resetSearchValue() }}></i>}
                        </div>
                    </div>


                </div>
                {isLoading === true ?
                    <>
                        {complaints.length === 0 ? <h6 className="endListMessage mt-3 pb-0">No Records to show</h6> :
                            <DataTable
                                columns={columns}
                                data={complaints}
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


                {/*COMPLAINT MODAL */}
                <Modal show={complaintModal.isVisible}>
                    <Modal.Header>
                        <h6>Complaint Message</h6>
                    </Modal.Header>

                    <Modal.Body className="privacyBody">
                        {complaintModal.data}
                    </Modal.Body>

                    <Modal.Footer className="pt-0">
                        <Button className="modalFootBtns btn" variant="secondary" onClick={handleComplaintModal}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/*COMPLAINT MODAL */}
            </>
        </div>
    )

}






