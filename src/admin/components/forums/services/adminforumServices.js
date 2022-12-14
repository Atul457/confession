// Helpers
import { fetchData } from "../../../../commonApi"
import toastMethods from "../../../../helpers/components/Toaster"
import { areAtLastPage, resHandler } from "../../../../helpers/helpers"
import { getKeyProfileLoc } from "../../../../helpers/profileHelper"
import { apiStatus } from "../../../../helpers/status"
import { deleteForumAcFn, deleteForumCommSubcomAcFn, deleteForum_AcFn, forumHandlers, handleSingleForumCommAcFn, mutateForumFn, usersToTagAcFn } from "../../../../redux/actions/forumsAc/forumsAc"
import auth from "../../../behindScenes/Auth/AuthCheck"
import SetAuth from "../../../behindScenes/Auth/SetAuth"
import { showSubCommentsFn, subComIniVal } from "../detailPage/comments/ForumCommProvider"

// Sends comment
const doCommentService = async ({
    commentBoxRef,
    postComment,
    dispatch,
    commentId = null,
    updateComment = false,
    navigate = () => { },
    forum_id,
    usedById = "",
    error = "",
    commentsCount = 1,
    page = 0,
    parent_root_info = {
        parent_id: "",
        root_id: "",
        parentIndex: ""
    },
    isSubComment = false,
    subCommentIndex = null
}) => {

    const regex = /(\scontenteditable="false"|<div><br><\/div>)/ig
    const postedCommet = commentBoxRef?.innerHTML?.replaceAll(regex, "")
    const userIdRegex = /dr99([\w]+)/gi
    let result
    let userstoTag = []
    while (result = userIdRegex?.exec(postedCommet)) {
        userstoTag = [...userstoTag, result[0].replaceAll("dr99", "")]
    }
    userstoTag = new Set(userstoTag)
    userstoTag = Array.from(userstoTag)

    const { handleCommentsAcFn } = forumHandlers
    let obj, data

    if (postedCommet === '')
        return dispatch(postComment({
            message: "This is required field",
            status: apiStatus.REJECTED,
            usedById
        }))
    if (error !== "") dispatch(postComment({ message: "", status: apiStatus.IDLE, usedById }))
    commentBoxRef.innerHTML = ""

    if (!auth()) {
        SetAuth(0);
        return navigate("/login");
    }

    data = {
        forum_id,
        tag_user_id: [...userstoTag],
        comment: postedCommet,
        post_as_anonymous: getKeyProfileLoc("post_as_anonymous"),
        ...parent_root_info,
        ...(updateComment && { comment_id: commentId })
    }

    obj = {
        data,
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "post",
        url: "postforumcomment"
    }

    try {

        dispatch(postComment({ status: apiStatus.LOADING, usedById }))
        const response = await fetchData(obj),
            { message, comment } = resHandler(response)

        dispatch(postComment({
            status: apiStatus.FULFILLED,
            message
        }))
        if (isSubComment) {

            if (updateComment) {
                dispatch(handleSingleForumCommAcFn({
                    parent_comment_index: parent_root_info?.parentIndex,
                    is_for_sub_comment: true,
                    comment_index: subCommentIndex,
                    data: {
                        comment: postedCommet
                    }
                }))

                dispatch(handleCommentsAcFn({ updateBox: {} }))
            }
            // Update
            else
                dispatch(forumHandlers?.handleCommentAcFn({
                    append: true,
                    commentIndex: parent_root_info?.parentIndex,
                    data: {
                        ...comment
                    }
                }))
        } else {
            // update comment
            if (updateComment) {
                dispatch(handleSingleForumCommAcFn({
                    comment_index: parent_root_info?.parentIndex,
                    is_for_sub_comment: false,
                    data: {
                        comment: postedCommet
                    }
                }))

                dispatch(handleCommentsAcFn({ updateBox: {} }))
            }

            // update comment
            else {
                if (areAtLastPage(20, commentsCount, page))   //APPENDS
                {
                    dispatch(forumHandlers.handleComments({
                        append: true,
                        data: {
                            ...comment,
                            subComments: {
                                ...(showSubCommentsFn(0)),
                                ...subComIniVal
                            }
                        }
                    }))
                }
            }
        }

        setTimeout(() => {
            dispatch(postComment({ message: "", status: apiStatus.IDLE }))
        }, 1000)
    }
    catch (err) {
        setTimeout(() => {
            dispatch(postComment({ message: err?.message ?? 'Something went wrong', status: apiStatus.REJECTED }))
        }, 1000)
    }
}

const likeDislikeService = async ({
    isLiked,
    forum_id,
    commentId,
    dispatch,
    like,
    commentIndex,
    parent_comment_index,
    is_for_sub_comment = false,
}) => {
    let is_liked, ip_address, check_ip;
    is_liked = isLiked ? 1 : 2;
    ip_address = localStorage.getItem("ip")
    check_ip = ip_address.split(".").length
    let data

    if (check_ip === 4) {
        let obj = {
            data: { is_liked, ip_address },
            token: getKeyProfileLoc("token", true, true) ?? "",
            method: "post",
            url: `likedislikeforumcommet/${forum_id}/${commentId}`
        }
        try {
            data = {
                like: isLiked ? like + 1 : like - 1,
                is_liked: isLiked ? 1 : 2
            }

            if (is_for_sub_comment)
                dispatch(handleSingleForumCommAcFn({
                    comment_index: commentIndex,
                    parent_comment_index,
                    is_for_sub_comment,
                    data
                }))
            else
                dispatch(handleSingleForumCommAcFn({
                    comment_index: commentIndex,
                    is_for_sub_comment,
                    data
                }))

            await fetchData(obj)

        } catch (error) {
            console.log(error);
            console.log("Some error occured");
        }
    } else {
        console.log("Invalid ip");
    }
}

// Pins/Unpins the forum
const pinForumService = async ({
    dispatch,
    isPinned,
    forum_id,
    forum_index
}) => {

    let obj;

    dispatch(mutateForumFn({
        forum_index,
        data_to_mutate: { is_pinned: isPinned ? 0 : 1 }
    }))

    obj = {
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "get",
        url: `setfavforum/${forum_id}/${isPinned ? 0 : 1}`
    }

    try {
        let res = await fetchData(obj)
        res = resHandler(res)
    } catch (error) {
        console.log(error)
    }

}

// DELETES THE COMMENT
const deleteForumCommService = async ({
    dispatch = () => { },
    commentId = null,
    parent_comment_index = null,
    forum_id,
    commentsCount = 0,
    isSubComment = false,
    comment_index = null
}) => {

    commentsCount = commentsCount ? commentsCount + 1 : 1
    let obj;

    if (isSubComment) {
        let indexArr = [];
        const ids = document.querySelectorAll(`.abc${commentId}`);
        ids.forEach(curr => indexArr.push(curr.getAttribute("index")))
        indexArr = [...new Set(indexArr)]
        indexArr = indexArr.reverse();
        const arrayOfNodesIndexes = [...indexArr, comment_index]

        dispatch(deleteForumCommSubcomAcFn({
            comment_index,
            parent_comment_index,
            arrayOfNodesIndexes,
            isSubComment
        }))
    } else {
        dispatch(deleteForumCommSubcomAcFn({
            comment_index,
            isSubComment: false,
            commentsCount
        }))
    }

    obj = {
        token: getKeyProfileLoc("token", true, true),
        method: "get",
        url: `admin/deleteforumcomment/${forum_id}/${commentId}`
    }

    try {
        let res = await fetchData(obj)
        res = resHandler(res)
    } catch (error) {
        console.log(error)
    }

}

// Returns users to be tagged
const getUsersToTagService = async ({
    strToSearch,
    forum_id,
    dispatch,
    isCalledByParent = false
}) => {

    let obj;
    let data = {
        search: strToSearch
    }

    obj = {
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "post",
        url: `gettaguser/${forum_id}`,
        data
    }

    try {
        let res = await fetchData(obj)
        res = resHandler(res)
        dispatch(usersToTagAcFn({
            data: res.users,
            status: apiStatus.FULFILLED,
            strToSearch,
            isCalledByParent
        }))
    } catch (error) {
        dispatch(usersToTagAcFn({
            message: error?.message,
            status: apiStatus.REJECTED,
            isCalledByParent
        }))
    }
}

const deleteForumService = async ({
    dispatch,
    forum_id,
    forum_index
}) => {
    let obj
    obj = {
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "get",
        url: `admin/deleteforum/${forum_id}`,
    }
    try {
        dispatch(deleteForum_AcFn({ forum_index }))
        let res = await fetchData(obj)
        res = resHandler(res)
        toastMethods.toaster2Info("Forum deleted successfully")
    } catch (error) {
        toastMethods.toaster2Info(error?.message)
    }
}



// Returns users to be tagged
const getForumsNConfessions = async ({ SearchReducer, selectedCategory }) => {
    const {
        type = 0,
        dispatch,
        page = 1,
        activeCategory,
        append = false,
        searchedWith = "",
    } = SearchReducer

    let obj,
        data = {
            search: searchedWith,
            type,
            page,
            "category_id": selectedCategory ?? activeCategory
        }

    obj = {
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "post",
        url: `search`,
        data
    }
    try {
        // dispatch(searchAcFn({
        //     status: apiStatus.LOADING
        // }))
        let res = await fetchData(obj)
        res = resHandler(res)
        // dispatch(searchAcFn({
        //     data: append ? [...SearchReducer?.data, ...res.posts] : res.posts,
        //     status: apiStatus.FULFILLED,
        //     hasMore: res.posts.length > 0
        // }))
    } catch (error) {
        // dispatch(searchAcFn({
        //     message: error?.message,
        //     status: apiStatus.REJECTED
        // }))
    }
}


// Get tags
const getTagsService = async ({
    dispatch
}) => {
    let obj = {
        data: {},
        token: getKeyProfileLoc("token", true, true) ?? "",
        method: "get",
        url: "gettags"
    }
    try {
        dispatch(forumHandlers.handleForumsTagsAcFn({ status: apiStatus.LOADING }))
        let res = await fetchData(obj)
        res = resHandler(res)
        const tags = res.tags?.map(curr => ({ value: curr, label: curr }))
        dispatch(forumHandlers.handleForumsTagsAcFn({ data: tags, status: apiStatus.FULFILLED }))
    } catch (error) {
        // dispatch(searchAcFn({
        //     message: error?.message ?? "Something went wrong",
        //     status: apiStatus.REJECTED
        // }))
    }
}




export {
    doCommentService,
    likeDislikeService,
    pinForumService,
    getUsersToTagService,
    getForumsNConfessions,
    deleteForumCommService,
    deleteForumService,
    getTagsService
}