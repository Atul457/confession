import React, { useState, useEffect, useRef } from 'react';
import Footer from './common/Footer';
import Header from './common/Header';
import Category from './Categories';
import InfiniteScroll from "react-infinite-scroll-component";
import auth from '../behindScenes/Auth/AuthCheck';
import Post from './Post';
import SiteLoader from '../../user/pageElements/components/SiteLoader';
import { Modal } from 'react-bootstrap';
import Button from '@restart/ui/esm/Button';
import { fetchData } from '../../commonApi';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import useCommentsModal from '../utilities/useCommentsModal';
import RefreshButton from '../../user/refreshButton/RefreshButton';
import _ from "lodash"
import AppLogo from '../../user/pageElements/components/AppLogo';
import CommentGotModal from './modals/CommentsGotModal';


export default function Dashboard() {

  if (!auth()) {
    window.location.href = "/talkplacepanel"
  }

  let actCategory = useLocation();

  // HITS API WILL PRESELECTED CATEGORY ON THE BASIS OF COMMENTS PAGE
  const [AC2S, setAC2] = useState(() => {
    if (actCategory.state)
      return actCategory.state.active;
    else
      return "";
  });

  //LOGOUT
  const logout = () => {
    localStorage.removeItem("adminDetails");
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "/talkplacepanel"
  }


  const editCategorySelect = useRef(null);
  const commentsModalReducer = useSelector(state => state.commentsModalReducer);
  const [categoryShow, setCategoryShow] = useState(false);
  const createCategorySelect = useRef(null);
  const [goDownArrow, setGoDownArrow] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [confCount, setConfCount] = useState(0);
  const [forceRender, setForceRender] = useState(false);
  // SETS INITIAL CATEGORY ON WHICH THE API WILL GET HIT TO GET CONFESSIONS
  const [activeCategory, setActiveCategory] = useState((AC2S) !== '' ? `${AC2S}` : `all`);
  const [confessions, setConfessions] = useState(false);
  const [confessionResults, setConfessionResults] = useState(true);
  const [addNewCategory, setAddNewCategory] = useState({ isVisible: false, isLoading: false });
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(false);
  const [createdCategory, setCreatedCategory] = useState({
    category_name: '',
    status: '1',
    id: ''
  });
  const [editedCategoryDetails, setEditedCategoryDetails] = useState({
    category_name: '',
    status: '',
    id: ''
  });
  const [categories, setCategories] = useState({
    isLoading: true,
    isError: false,
    data: []
  });
  const [token] = useState(() => {
    if (auth()) {
      let details = localStorage.getItem("adminDetails");
      if (details) {
        details = JSON.parse(details);
        return details.token;
      } else {
        logout();
      }
    } else {
      logout();
    }
  });
  //CUSTOM HOOK
  const [commentsModalRun, commentsModal, changes, handleChanges, handleCommentsModal, CommentsGotModal] = useCommentsModal();


  useEffect(() => {
    async function getData() {

      let obj = {
        token: token,
        data: {},
        method: "post",
        url: "admin/getcategories"
      }
      try {
        const res = await fetchData(obj)
        if (res.data.status === true) {
          setCategories({
            isLoading: false,
            isError: false,
            data: res.data.categories
          })
        } else {
          setCategories({
            ...categories,
            isLoading: false,
            isError: true,
            message: res.data.message
          })
        }
      } catch {
        setCategories({
          ...categories,
          isLoading: false,
          isError: true,
          message: ""
        })
      }
    }

    getData();
  }, [])


  async function getConfessions(append, act, page) {
    setConfessionResults(true);

    let obj = {
      data: {},
      token: "",
      method: "get",
      url: `getconfessions/${act}/${page}`
    }
    try {
      const response = await fetchData(obj)
      if (response.data.status === true) {
        if (append) {
          let newConf = [...confessions, ...response.data.confessions];
          setConfessions(newConf);
        }
        else {
          setConfCount(response.data.count);
          setConfessions(response.data.confessions);
          let windowHeight = window.innerWidth;
          if (windowHeight > 768) {
            window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
          }
        }
      } else {
        setConfessions(false);
        setConfessionResults(false);
      }
    } catch {
      setConfessions(false);
      setConfessionResults(false);    //SERVER ERROR
    }
  }


  //HITS API TO GET CONFESSIONS
  useEffect(() => {
    getConfessions(false, activeCategory, 1);
    setPageNo(1);
  }, [activeCategory])


  useEffect(() => {
    if (pageNo !== 1) {
      getConfessions(true, activeCategory, pageNo);
    }
  }, [pageNo])


  // HANDLES SCROLL TO TOP BUTTON
  useEffect(() => {
    document.addEventListener("scroll", () => {
      let scroll = document.querySelector("html").scrollTop;
      if (scroll > 3000) {
        setGoDownArrow(true);
      } else {
        setGoDownArrow(false);
      }
    })
  }, [])


  //Update Confessions
  const updateConfessions = (confessionId) => {
    setConfCount((prevState) => prevState - 1);
    // setConfessions
    let newConfArr = confessions.filter((current) => {
      if (current.confession_id !== confessionId) {
        return current;
      }
    })

    setConfessions(newConfArr);
    setConfCount((prevState) => prevState - 1);
  }


  // UPDATES THE ACTIVECATEGORY
  const updateActiveCategory = (activeCat) => {
    setConfessions(false);
    setConfCount(1);
    setPageNo(1);
    setActiveCategory(`${activeCat}`);
  }


  const fetchMoreData = () => {
    let page = pageNo;
    page = parseInt(page) + 1;
    setPageNo(page);
  }


  //SCROLLS TO BOTTOM
  const goUp = () => {
    window.scrollTo({ top: "0px", behavior: "smooth" });
  }


  // ADD CATEGORY MODAL

  // OPENS ADD CATEGORIES MODAL
  const openAddCategoriesModalFunc = () => {
    setAddNewCategory({ ...addNewCategory, visible: true });
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
    }
    else {
      setAddNewCategory({ ...addNewCategory, isLoading: true });
      let data = {
        "category_name": createdCategory.category_name,
        "status": createdCategory.status
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
          setCategories((prevState) => ({
            ...prevState, data: [...prevState.data,
            ...res.data.category
            ]
          }));
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

  const handleCreateCategoryDetails = ({ name, value }) => {
    setCreatedCategory({ ...createdCategory, [name]: value });
    createCategorySelect.current.click();
  }

  const closeAddCategoryModalFunc = () => {
    setAddNewCategory({ isLoading: false, visible: false });
  }


  // OPENS ADD EDIT MODAL
  const openEditCategoriesModalFunc = (categoryObject) => {
    setEditCategoryModal(true);
    setEditedCategoryDetails({
      category_name: categoryObject.category_name,
      status: categoryObject.status,
      id: categoryObject.id
    })
  }


  // UPDATES THE CATEGORY
  const updateCategoryModalFunc = async () => {
    let updateModalError = document.querySelector('.updateModalError');

    setUpdateCategory(true);
    let data = {
      category_name: editedCategoryDetails.category_name,
      status: editedCategoryDetails.status,
      category_id: editedCategoryDetails.id
    }


    let obj = {
      data: data,
      token: token,
      method: "post",
      url: "admin/createcategory"
    }


    try {
      let res = await fetchData(obj);
      if (res.data.status === true) {
        let newArr = categories.data.map((current) => {
          if (current.id === editedCategoryDetails.id) {
            return editedCategoryDetails;
          } else {
            return current;
          }
        })
        setCategories({
          ...categories,
          data: newArr
        });
        setEditCategoryModal(false);
        setUpdateCategory(false);
      } else {
        setUpdateCategory(false);
        updateModalError.innerText = res.data.message;
      }
    }
    catch {
      setUpdateCategory(false);
      console.log("Some error occured");
    }
  }

  const closeEditCategoryModalFunc = () => {
    setEditCategoryModal(false);
    setEditedCategoryDetails({
      category_name: "",
      status: "",
      category_id: ""
    });
    setUpdateCategory(false);
    setDeleteCategory(false);
  }

  const deleteEditCategoryModalFunc = async () => {

    let confirmation = window.confirm("Do you really want to delete the category?");
    if (confirmation === true) {
      let updateModalError = document.querySelector('.updateModalError');
      setDeleteCategory(true);

      let obj = {
        data: {},
        token: token,
        method: "get",
        url: `admin/deletecategory/${editedCategoryDetails.id}`
      }

      try {
        let res = await fetchData(obj);
        if (res.data.status === true) {
          let newArr = categories.data.filter((current) => {
            if (current.id !== editedCategoryDetails.id) {
              return current;
            }
          });

          setCategories({
            ...categories,
            data: newArr
          });

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


  const updateConfessionData = (_viewcount, sharedBy, index) => {
    let updatedConfessionArray;
    let updatedConfessionNode;
    let shared = sharedBy;
    updatedConfessionArray = [...confessions];
    updatedConfessionNode = updatedConfessionArray[index];
    updatedConfessionNode = {
      ...updatedConfessionNode,
      "no_of_comments": shared,
      "viewcount": _viewcount
    };
    updatedConfessionArray[index] = updatedConfessionNode;
    setConfessions([...updatedConfessionArray]);
  }

  const updatedConfessions = (index, data) => {
    let updatedConfessionArray;
    let updatedConfessionNode;
    updatedConfessionArray = [...confessions];
    updatedConfessionNode = updatedConfessionArray[index];
    updatedConfessionNode = {
      ...updatedConfessionNode,
      ...data
    };
    updatedConfessionArray[index] = updatedConfessionNode;
    setConfessions([...updatedConfessionArray]);
  }


  return (
    <>
      {
        auth() ?
          <div className="container-fluid">
            {commentsModalReducer.visible && <CommentGotModal
              handleChanges={handleChanges}
              updateConfessionData={updateConfessionData}
              updatedConfessions={updatedConfessions}
              state={commentsModal}
              handleCommentsModal={handleCommentsModal} />}
            <div className="row outerContWrapper">

              {/* Adds Header Component */}
              <Header links={true} />


              <div className="leftColumn leftColumnFeed">
                <div className="leftColumnWrapper">
                  <AppLogo />

                  <div className="middleContLoginReg feedMiddleCont">
                    {/* CATEGORYCONT */}
                    <aside className="posSticky">
                      {/* <Category categories={props.categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} /> */}
                      <Category editVisible={true} openEditCategoriesModalFunc={openEditCategoriesModalFunc} openAddCategoriesModalFunc={openAddCategoriesModalFunc} categories={categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} />
                    </aside>
                    {/* CATEGORYCONT */}
                  </div>
                </div>
              </div>



              <div className="rightColumn rightColumnFeed">
                <div className="rightMainFormCont rightMainFormContFeed p-0">
                  <div className="preventHeader">preventHead</div>
                  <div className="w-100 py-md-4 p-0 p-md-3 preventFooter">
                    <div className="row forPosSticky">

                      {/* MIDDLECONTAINER */}
                      <section className="col-lg-12 col-12 mt-0 mt-lg-0 px-0 px-md-3">
                        <div className="postsMainCont">

                          <div className="row mx-0">
                            <div className="expandableCategory d-none">
                              <div className="head" onClick={() => setCategoryShow(!categoryShow)}>
                                Choose a Category to filter posts
                                <span>
                                  <i aria-hidden="true" className={`fa fa-chevron-down categoryDownIcon ${categoryShow ? "rotateUpsideDown" : ""}`}></i>
                                </span>
                              </div>
                              {categoryShow && <div className="body">
                                {/* CATEGORYCONT */}
                                <aside className="col-12 col-md-4 posSticky mobileViewCategories d-none">
                                  <Category hideHead={true} categories={categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} />
                                </aside>
                                {/* CATEGORYCONT */}
                              </div>}
                            </div>

                            <div className="filterVerbiage foot">
                              * Filter out posts by clicking on the categories above. Unselect the category to remove the filter.
                            </div>



                            {/* CATEGORYCONT */}
                            {/* <aside className="col-12 col-md-4 posSticky">
                              <Category editVisible={true} openEditCategoriesModalFunc={openEditCategoriesModalFunc} openAddCategoriesModalFunc={openAddCategoriesModalFunc} categories={categories} activeCatIndex={AC2S} updateActiveCategory={updateActiveCategory} />
                            </aside> */}
                            {/* CATEGORYCONT */}

                            {/* CONFESSIONS CONT */}
                            <div className="postsWrapperFeed col-12 px-0">
                              {confessions
                                ?
                                <InfiniteScroll
                                  scrollThreshold="80%"
                                  endMessage={
                                    <div className="text-center endListMessage pb-0 mt-4">
                                      {confessions.length === 0 ? "No confessions found" : "End of Confessions"}</div>}
                                  dataLength={confessions.length}
                                  next={fetchMoreData}
                                  hasMore={confessions.length < confCount}
                                  loader={
                                    <div className="spinner-border pColor" role="status">
                                      <span className="sr-only">Loading...</span>
                                    </div>
                                  }
                                >
                                  {confessions.map((post, index) => {
                                    return (<>
                                      <Post
                                        confession_id={post.confession_id}
                                        isNotFriend={post.isNotFriend}
                                        like={post.like}
                                        dislike={post.dislike}
                                        is_liked={post.is_liked}
                                        is_viewed={post.is_viewed}
                                        updatedConfessions={updatedConfessions}
                                        key={`dashBoardPost${index}`}
                                        index={index}
                                        viewcount={post.viewcount}
                                        handleCommentsModal={handleCommentsModal}
                                        updateConfessions={updateConfessions}
                                        updateConfessionData={updateConfessionData}
                                        createdAt={post.created_at}
                                        post_as_anonymous={post.post_as_anonymous}
                                        curid={post.user_id === '0' ? false : post.user_id}
                                        category_id={post.category_id}
                                        profileImg={post.profile_image}
                                        postId={post.confession_id} imgUrl={post.image === '' ? '' : post.image}
                                        userName={post.created_by}
                                        category={post.category_name}
                                        postedComment={post.description}
                                        updateData={post.description}
                                        sharedBy={post.no_of_comments} />
                                    </>)
                                  })}
                                </InfiniteScroll>

                                :
                                (
                                  confessionResults
                                    ?
                                    (<div className="spinner-border pColor" role="status">
                                      <span className="sr-only">Loading...</span>
                                    </div>)
                                    :
                                    (<div className="alert alert-danger" role="alert">
                                      Unable to get confessions
                                    </div>)

                                )
                              }
                            </div>
                            {/* CONFESSIONS CONT */}
                          </div>
                        </div>

                      </section>
                      {/* MIDDLECONTAINER */}
                    </div>
                  </div>
                </div>
              </div>


              {/* ADD CATEGORIES MODAL */}
              <Modal show={addNewCategory.visible}>
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
                    <input type="text" name="category_name" value={editedCategoryDetails.category_name} onChange={(e) => handleEditCategoryDetails(e.target)} className="form-control" placeholder="Enter a Category" />

                    <select ref={editCategorySelect} className="form-control mt-2" name="status" value={(editedCategoryDetails.status).toString()} onChange={(e) => handleEditCategoryDetails(e.target)}>
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
                  </div>

                  <div className="errorCont updateModalError text-danger mt-1">
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
              {/* ADD CATEGORIES MODAL */}

              <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
              <Footer />

              {/* REFRESH BUTTON */}
              {commentsModal.visibility === false && changes && <RefreshButton />}
            </div>
          </div>
          : <SiteLoader />
      }
    </>
  )
}
