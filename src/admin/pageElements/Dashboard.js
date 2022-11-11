import React, { useState, useEffect } from 'react';
import Footer from './common/Footer';
import Header from './common/Header';
import InfiniteScroll from "react-infinite-scroll-component";
import auth from '../behindScenes/Auth/AuthCheck';
import Post from './Post';
import SiteLoader from '../../user/pageElements/components/SiteLoader';
import { fetchData } from '../../commonApi';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import _ from "lodash"
import AppLogo from '../../user/pageElements/components/AppLogo';
import { getCategoriesService } from '../../components/forums/services/forumServices';
import ForumCategoriesAdmin, { ExpandableForumCatsAdmin } from '../components/forums/forumCategories/ForumCategoriesAdmin';


export default function Dashboard() {

  if (!auth()) {
    window.location.href = "/talkplacepanel"
  }

  let actCategory = useLocation();
  const dispatch = useDispatch()

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

  const {
    categories
  } = useSelector(state => state.forumsReducer)
  const [goDownArrow, setGoDownArrow] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [confCount, setConfCount] = useState(0);
  const { activeCategory } = categories
  const [confessions, setConfessions] = useState(false);
  const [confessionResults, setConfessionResults] = useState(true);

  useEffect(() => {
    getCategoriesService({ dispatch })
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
    getConfessions(false, activeCategory === 0 ? "all" : activeCategory, 1);
    setPageNo(1);
  }, [activeCategory])


  useEffect(() => {
    if (pageNo !== 1) {
      getConfessions(true, activeCategory, pageNo);
    }
  }, [pageNo])


  // HANDLES SCROLL TO TOP BUTTON
  useEffect(() => {

    const listener = () => {
      let scroll = document.querySelector("html").scrollTop;
      if (scroll > 3000) {
        setGoDownArrow(true);
      } else {
        setGoDownArrow(false);
      }
    }

    document.addEventListener("scroll", listener)
    
    return () => {
      document.removeEventListener("scroll", listener)
    }
  }, [])


  //Update Confessions
  const updateConfessions = (confessionId) => {
    setConfCount((prevState) => prevState - 1);
    let newConfArr = confessions.filter((current) => {
      if (current.confession_id !== confessionId) {
        return current;
      }
    })

    setConfessions(newConfArr);
    setConfCount((prevState) => prevState - 1);
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
            <div className="row outerContWrapper">

              {/* Adds Header Component */}
              <Header links={true} />


              <div className="leftColumn leftColumnFeed">
                <div className="leftColumnWrapper">
                  <AppLogo />

                  <div className="middleContLoginReg feedMiddleCont">
                    {/* CATEGORYCONT */}
                    <aside className="posSticky">
                      <ForumCategoriesAdmin />
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
                            <ExpandableForumCatsAdmin isUsedOnConfessionPage={true} classNames="d-block d-md-none" />

                            <div className="filterVerbiage foot">
                              * Filter out posts by clicking on the categories above. Unselect the category to remove the filter.
                            </div>

                            {/* CONFESSIONS CONT */}
                            <div className="postsWrapperFeed col-12 px-0">
                              {confessions
                                ?
                                <InfiniteScroll
                                  scrollThreshold="80%"
                                  endMessage={
                                    <div className="text-center endListMessage pb-0 mt-4 noConfessionsw w-100">
                                      {confessions.length === 0 ? "No confessions found in this category" : "End of Confessions"}</div>}
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
                                    return (
                                      <Post
                                        confession_id={post.confession_id}
                                        post={post}
                                        slug={post.slug}
                                        isNotFriend={post.isNotFriend}
                                        cover_image={post.cover_image ?? ''}
                                        like={post.like}
                                        dislike={post.dislike}
                                        is_liked={post.is_liked}
                                        is_viewed={post.is_viewed}
                                        updatedConfessions={updatedConfessions}
                                        key={`dashBoardPost${index}`}
                                        index={index}
                                        viewcount={post.viewcount}
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
                                        sharedBy={post.no_of_comments} />)
                                  })}
                                </InfiniteScroll>

                                :
                                (
                                  confessionResults
                                    ?
                                    (<div className="text-center">
                                      <div className="spinner-border pColor" role="status">
                                        <span className="sr-only">Loading...</span>
                                      </div>
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

              <i className={`fa fa-arrow-circle-o-up goUpArrow ${goDownArrow === true ? "d-block" : "d-none"}`} aria-hidden="true" type="button" onClick={goUp}></i>
              <Footer />

            </div>
          </div>
          : <SiteLoader />
      }
    </>
  )
}
