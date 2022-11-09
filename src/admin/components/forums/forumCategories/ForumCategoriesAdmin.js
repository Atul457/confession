import React, { useEffect, useRef, useState } from 'react'

// Redux 
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { forumHandlers } from '../../../../redux/actions/forumsAc/forumsAc'

// Helpers
import { apiStatus } from '../../../../helpers/status'
import { Button, Modal } from 'react-bootstrap'
import auth from '../../../behindScenes/Auth/AuthCheck'
import { fetchData } from '../../../../commonApi'
import { getKeyProfileLoc } from '../../../../helpers/profileHelper'
import { scrollDetails } from '../../../../helpers/helpers'


const ForumCategoriesAdmin = ({
    isExpandable = false,
    classNames = "",
    hideEditsAndStatus = false,
    isUsedOnConfessionPage = !window.location.pathname.includes("forum")
}) => {

    // Hooks and vars
    const { categories: categoriesRed } = useSelector(state => state.forumsReducer),
        SearchReducer = useSelector(state => state.SearchReducer),
        { data: categories, activeCategory } = categoriesRed,
        location = useLocation()?.pathname,
        navigate = useNavigate(),
        dispatch = useDispatch()
    const createCategorySelect = useRef(null);
    const editCategorySelect = useRef(null);
    const [editCategoryModal, setEditCategoryModal] = useState(false);
    const [updateCategory, setUpdateCategory] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState(false);
    const [editedCategoryDetails, setEditedCategoryDetails] = useState({
        category_name: '',
        status: '',
        id: ''
    });
    const [types, setTypes] = useState({
        confession: false,
        forum: false
    })
    const [addNewCategory, setAddNewCategory] = useState({ isVisible: false, isLoading: false });
    const [createdCategory, setCreatedCategory] = useState({
        category_name: '',
        status: '1',
        id: ''
    });

    // Functions

    const handleTypes = (e) => {
        setTypes({
            ...types,
            [e.target.name]: !types[e.target?.name]
        })
    }

    const openAddCategoryModal = () => {
        setAddNewCategory({
            isLoading: false,
            isVisible: true
        })
    }

    // UPDATES THE CATEGORY
    const updateCategoryModalFunc = async () => {
        let updateModalError = document.querySelector('.updateModalError');
        if (types.confession === false && types.forum === false)
            return updateModalError.innerHTML = "Please select either forum or confession"
        updateModalError.innerHTML = ""

        setUpdateCategory(true);
        let data = {
            category_name: editedCategoryDetails.category_name,
            status: editedCategoryDetails.status,
            category_id: editedCategoryDetails.id,
            is_confession: types.confession ? 1 : 0,
            is_forum: types.forum ? 1 : 0,
        }

        let obj = {
            data: data,
            token: getKeyProfileLoc("token", true, true),
            method: "post",
            url: "admin/createcategory"
        }


        try {
            let res = await fetchData(obj);
            if (res.data.status === true) {
                let newArr = categories.map((current) => {
                    if (current.id === editedCategoryDetails.id) {
                        return res.data.category[0];
                    } else {
                        return current;
                    }
                })
                dispatch(forumHandlers.handleForumCatsAcFn({ data: newArr }))
                setEditCategoryModal(false);
                setTypes({
                    confession: false,
                    forum: false
                })
                setUpdateCategory(false);
            } else {
                setUpdateCategory(false);
                updateModalError.innerText = res.data.message;
            }
        }
        catch (err) {
            setUpdateCategory(false);
            console.log("Some error occured");
        }
    }

    // OPENS ADD EDIT MODAL
    const openEditCategoriesModalFunc = (categoryObject) => {
        setEditCategoryModal(true);
        setEditedCategoryDetails({
            category_name: categoryObject.category_name,
            status: categoryObject.status,
            id: categoryObject.id
        })
        setTypes({
            confession: categoryObject.is_confession,
            forum: categoryObject.is_forum
        })
    }

    const deleteEditCategoryModalFunc = async () => {

        let confirmation = window.confirm("Do you really want to delete the category?");
        if (confirmation === true) {
            let updateModalError = document.querySelector('.updateModalError');
            setDeleteCategory(true);

            let obj = {
                data: {},
                token: getKeyProfileLoc("token", true, true),
                method: "get",
                url: `admin/deletecategory/${editedCategoryDetails.id}`
            }

            try {
                let res = await fetchData(obj);
                if (res.data.status === true) {
                    let newArr = categories.filter((current) => {
                        if (current.id !== editedCategoryDetails.id) {
                            return current;
                        }
                    });

                    dispatch(forumHandlers.handleForumCatsAcFn({ data: newArr }))
                    setEditCategoryModal(false);
                    setDeleteCategory(false);
                } else {
                    setDeleteCategory(false);
                    updateModalError.innerText = res.data.message;
                }
            }
            catch {
                setDeleteCategory(false);
                console.log("Some error occured");
            }
        }
    }

    const handleEditCategoryDetails = ({ name, value }) => {
        setEditedCategoryDetails({ ...editedCategoryDetails, [name]: value });
        editCategorySelect.current.click();
    }


    const handleCreateCategoryDetails = ({ name, value }) => {
        setCreatedCategory({ ...createdCategory, [name]: value });
        createCategorySelect.current.click();
    }

    const closeEditCategoryModalFunc = () => {
        setEditCategoryModal(false);
        setTypes({
            confession: false,
            forum: false
        })
        setEditedCategoryDetails({
            category_name: "",
            status: "",
            category_id: ""
        });
        setUpdateCategory(false);
        setDeleteCategory(false);
    }


    //LOGOUT
    const logout = () => {
        localStorage.removeItem("adminDetails");
        localStorage.removeItem("adminAuthenticated");
        window.location.href = "/talkplacepanel"
    }

    const closeAddCategoryModalFunc = () => {
        setTypes({
            confession: false,
            forum: false
        })
        setAddNewCategory({ isLoading: false, visible: false });
    }

    const addNewCategoryModalFunc = async () => {
        let addNewCategoryErrCont = document.querySelector('.editModalError'), adminDetails;
        addNewCategoryErrCont.innerText = '';

        if (auth()) {
            adminDetails = localStorage.getItem("adminDetails");
            if (adminDetails) {
                adminDetails = JSON.parse(adminDetails);
            } else {
                logout();
            }
        } else {
            logout();
        }

        if (createdCategory.category_name.trim() === "") {
            addNewCategoryErrCont.innerText = "Category Name is required";
        } else if (types.confession === false && types.forum === false)
            return addNewCategoryErrCont.innerHTML = "Please select either forum or confession"
        else {
            setAddNewCategory({ ...addNewCategory, isLoading: true });
            addNewCategoryErrCont.innerHTML = ""
            let data = {
                "category_name": createdCategory.category_name,
                "status": createdCategory.status,
                "is_confession": types.confession ? 1 : 0,
                "is_forum": types.forum ? 1 : 0,
            }

            let obj = {
                data: data,
                token: adminDetails.token,
                method: "post",
                url: "admin/createcategory"
            }
            try {
                const res = await fetchData(obj);
                if (res.data.status === true) {
                    setAddNewCategory({ isLoading: false, visible: false });
                    dispatch(forumHandlers.handleForumCatsAcFn({ data: [...categories, ...res?.data?.category] }))
                    setCreatedCategory({
                        category_name: '',
                        status: '1',
                        id: ''
                    });
                } else {
                    addNewCategoryErrCont.innerText = res.data.message;
                    setAddNewCategory({ ...addNewCategory, isLoading: false });
                }
            } catch {
                setAddNewCategory({ ...addNewCategory, isLoading: false });
                console.log("Some error occured");
            }
        }
    }

    useEffect(() => {
        const dataToSend = {
            postComment: {
                status: apiStatus.IDLE,
                message: "",
            },
            status: apiStatus.LOADING,
            data: [],
            message: "",
            actionBox: {},
            page: 1,
            comments: {
                status: apiStatus.LOADING,
                data: [{
                    subComments: {
                        status: apiStatus.IDLE,
                        data: [],
                        message: "",
                    }
                }],
                message: ""
            }
        }
        dispatch(forumHandlers.handleForum(dataToSend))
    }, [])

    return (
        <div className={`row ${classNames} admin px-lg-2`}>
            {!isExpandable ?
                <div className="categoryHead col-12">
                    Choose categories
                </div> : null}

            <div className="categoriesContainer w-100">
                {categories.map((category, cindex) => {
                    return <Category
                        isUsedOnConfessionPage={isUsedOnConfessionPage}
                        SearchReducer={SearchReducer}
                        hideEditsAndStatus={hideEditsAndStatus}
                        location={location}
                        activeCategory={activeCategory}
                        navigate={navigate}
                        category={category}
                        openEditCategoriesModalFunc={openEditCategoriesModalFunc}
                        key={`forumsCategory${cindex}${category?.id}`}
                        categoryName={category?.category_name}
                        cindex={cindex + 1} />
                })}

                {/* Add new category */}
                <div
                    className={`category cursor_pointer adminCategorySidebar`}
                    type='button'
                    onClick={openAddCategoryModal}>
                    <span className="innerAdminCatName"><i className="fa fa-plus" aria-hidden="true"></i>Add Category</span>
                </div>
                {/* Add new category */}


            </div>

            {/* ADD CATEGORIES MODAL */}
            <Modal show={addNewCategory.isVisible}>
                <Modal.Header>
                    <h6>Create a Category</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody">

                    <div className="addNewCategoryInput">
                        <div className="errorCont text-danger mb-1"></div>
                        <input type="text" name="category_name" maxLength="20" value={createdCategory.category_name} onChange={(e) => handleCreateCategoryDetails(e.target)} className="form-control" placeholder="Enter a Category" />

                        <select ref={createCategorySelect} className="form-control mt-2" name="status" value={(createdCategory.status).toString()} onChange={(e) => handleCreateCategoryDetails(e.target)}>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                        </select>
                    </div>

                    <div className="w-100 mt-2 d-flex justify-content-start flex-wrap type_checkboxes">
                        <div className="d-flex flex-wrap align-items-center mr-3">
                            <label className='mb-0 mr-1' htmlFor='confessionCCheckbox'>Post</label>
                            <input
                                type="checkbox"
                                id="confessionCCheckbox"
                                name="confession"
                                checked={types.confession}
                                onChange={handleTypes} />
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            <label className='mb-0 mr-1' htmlFor='forumCCheckbox'>Forum</label>
                            <input
                                type="checkbox"
                                id="forumCCheckbox"
                                name="forum"
                                checked={types.forum}
                                onChange={handleTypes} />
                        </div>
                    </div>

                    <div className="errorCont editModalError text-danger mt-1">
                    </div>

                </Modal.Body>
                <Modal.Footer className="pt-0">
                    <Button className="modalFootBtns btn" variant="primary" onClick={closeAddCategoryModalFunc}>
                        Cancel
                    </Button>
                    <Button className="modalFootBtns btn" variant="primary" onClick={addNewCategoryModalFunc}>
                        {addNewCategory.isLoading === true
                            ?
                            <div className="spinnerSizePost spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            "Create"}

                    </Button>
                </Modal.Footer>
            </Modal>
            {/* ADD CATEGORIES MODAL */}

            {/* EDIT CATEGORIES MODAL */}
            <Modal show={editCategoryModal}>
                <Modal.Header>
                    <h6>Update Category</h6>
                </Modal.Header>
                <Modal.Body className="privacyBody">

                    <div className="addNewCategoryInput">
                        <div className="errorCont text-danger mb-1"></div>

                        <input
                            type="text"
                            name="category_name"
                            value={editedCategoryDetails.category_name}
                            onChange={(e) => handleEditCategoryDetails(e.target)}
                            className="form-control" placeholder="Enter a Category" />

                        <select
                            ref={editCategorySelect}
                            className="form-control mt-2"
                            name="status"
                            value={(editedCategoryDetails.status).toString()}
                            onChange={(e) => handleEditCategoryDetails(e.target)}>
                            <option value="1">Active</option>
                            <option value="2">Inactive</option>
                        </select>

                        <div className="w-100 mt-2 d-flex justify-content-start flex-wrap type_checkboxes">
                            <div className="d-flex flex-wrap align-items-center mr-3">
                                <label className='mb-0 mr-1' htmlFor='confessionUCheckbox'>Post</label>
                                <input
                                    type="checkbox"
                                    id="confessionUCheckbox"
                                    name="confession"
                                    checked={types.confession}
                                    onChange={handleTypes} />
                            </div>
                            <div className="d-flex flex-wrap align-items-center">
                                <label className='mb-0 mr-1' htmlFor='forumUCheckbox'>Forum</label>
                                <input
                                    type="checkbox"
                                    id="forumUCheckbox"
                                    name="forum"
                                    checked={types.forum}
                                    onChange={handleTypes} />
                            </div>
                        </div>

                    </div>

                    <div className="errorCont updateModalError text-danger mt-2">
                    </div>

                </Modal.Body>
                <Modal.Footer className="pt-0">
                    <Button className="modalFootBtns btn" variant="primary" onClick={closeEditCategoryModalFunc}>
                        Cancel
                    </Button>
                    <Button className="modalFootBtns btn" variant="primary" disabled={updateCategory} onClick={deleteEditCategoryModalFunc}>
                        {deleteCategory === true
                            ?
                            <div className="spinnerSizePost spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            "Delete"}

                    </Button>
                    <Button className="modalFootBtns btn" variant="primary" disabled={deleteCategory} onClick={updateCategoryModalFunc}>
                        {updateCategory === true ?
                            <div className="spinnerSizePost spinner-border text-white" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            "Update"}

                    </Button>
                </Modal.Footer>
            </Modal>
            {/*  EDIT CATEGORIES MODAL */}
        </div>

    )
}

const ExpandableForumCatsAdmin = ({ classNames = "", isUsedOnConfessionPage = false }) => {

    const [showCat, setShowCat] = useState(false)
    return (
        <div className={`expandableCategory d-block ${classNames}`}>
            <div className="head" onClick={() => setShowCat(!showCat)}>
                Choose a category to filter
                <span>
                    <i aria-hidden="true" className={`fa fa-chevron-down categoryDownIcon ${showCat ? "rotateUpsideDown" : ""}`}></i>
                </span>
            </div>
            {showCat && <div className="body">
                {/* CATEGORYCONT */}
                <aside className="col-12 col-md-4 posSticky mobileViewCategories d-none">
                    <ForumCategoriesAdmin
                        isUsedOnConfessionPage={isUsedOnConfessionPage}
                        hideEditsAndStatus={true}
                        isExpandable={true}
                    />
                </aside>
                {/* CATEGORYCONT */}
            </div>}

        </div>
    )
}

const Category = props => {

    const {
        categoryName,
        cindex,
        activeCategory,
        location,
        navigate,
        hideEditsAndStatus,
        isUsedOnConfessionPage,
        category,
        openEditCategoriesModalFunc = () => { }
    } = props;
    const dispatch = useDispatch(),
        isActiveCategory = activeCategory === cindex,
        forumHomePageLink = "/admin/forums",
        confessionHomeLink = "/dashboard",
        isForumHomePage = location === forumHomePageLink,
        isConfessionHomePage = location === confessionHomeLink

    const switchCategory = categoryToActivate => {
        let isSameCatClicked = activeCategory === categoryToActivate,
            allCategories = 0;
        categoryToActivate = isSameCatClicked ? allCategories : categoryToActivate
        dispatch(forumHandlers.handleForumCatsAcFn({ activeCategory: categoryToActivate }))
        scrollDetails.setScrollDetails({})

        if (!isForumHomePage || !isConfessionHomePage) {
            navigate(isUsedOnConfessionPage ? confessionHomeLink : forumHomePageLink)
        }
    }

    return (
        <div
            className={`category cursor_pointer adminCategorySidebar ${isActiveCategory ? "activeCategory" : ""}`}
            type='button'
            onClick={(e) => {
                if (!e.target.classList.contains("categoryEditIcon"))
                    switchCategory(cindex)
            }}
            id={`forumCat${cindex}`}>
            {/* {!hideEditsAndStatus ? */}
            <>
                <i className="fa fa-pencil categoryEditIcon adminCats"
                    onClick={() => {
                        openEditCategoriesModalFunc({
                            id: category.id,
                            status: category.status,
                            category_name: category.category_name,
                            is_confession: category.is_confession,
                            is_forum: category.is_forum,
                        })
                    }}
                    aria-hidden="true"
                    type="button"></i>

                <span className={`categoryStatus ${parseInt(category.status) === 1 ? "categoryStatusGreen" : "categoryStatusRed"}`}></span>
            </>
            {/* : null} */}

            <span className="innerAdminCatName">{categoryName?.toLowerCase()}</span>
        </div>
    )
}

export default ForumCategoriesAdmin
export { ExpandableForumCatsAdmin }