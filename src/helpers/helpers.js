import auth from "../user/behindScenes/Auth/AuthCheck";
import { avatars } from "./avatars/Avatars";
import { getKeyProfileLoc } from "./profileHelper";

const getLocalStorageKey = key => {
    let value = localStorage.getItem(key) ?? false;
    return value;
}

const setLocalStoragekey = (key, value) => {
    if (!key || value === undefined) return messageGenerator(false, "key or value is undefined")
    localStorage.setItem(key, value)
    return messageGenerator(false, "data is saved to localstorage", { key: value })
}

const messageGenerator = (status = false, message = '', data = {}) => {
    return { status, message, data }
}

const resHandler = res => {
    const { data } = res
    if (data.status === true)
        return data
    throw new Error(res?.data?.message ?? "Something went wrong")
}


// Checks whether or not avatar image is used on profile currently
const isAvatarSelectedCurr = () => {
    let imgurl = "",
        check
    if (auth()) {
        imgurl = getKeyProfileLoc("image")
        if (imgurl && imgurl.indexOf("avatar") !== -1)
            avatars.forEach((curr, index) => {
                let src = curr.src
                src = src.split("/")
                imgurl = `${imgurl}`.split("/")
                src = src[src.length - 1]
                imgurl = imgurl[imgurl.length - 1]
                if (src === imgurl) {
                    check = messageGenerator(true, "Avatar is selected", {
                        currentSelected: curr.src,
                        avatarImageIndex: index
                    })
                    return false
                }
            })
    }

    if (!check || check === "") {
        check = messageGenerator(false, "Avatar is not selected")
    }

    return check
}

const areAtLastPage = (pageSize = 20, commentsCount = 0, currPage) => {
    var totalPages, isAtLastPage = false;
    pageSize = 20;
    totalPages = Math.ceil(commentsCount / pageSize);
    totalPages = totalPages === 0 ? (totalPages + 1) : totalPages;
    isAtLastPage = totalPages === currPage
    return isAtLastPage
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
}

// ** Converts table to CSV
function convertArrayOfObjectsToCSV(array) {
    let result
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const cols = Object.keys(array[0]).map(curr => curr?.toUpperCase())
    const keys = Object.keys(array[0])


    result = ''
    result += cols.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter
            result += item[key]
            ctr++
        })
        result += lineDelimiter
    })

    return result
}

const exportToCsv = ({ array = [] }) => {
    const link = document.createElement('a')
    const NewOne = array.map(item => {
        delete item.id
        delete item.status
        delete item.source

        delete item.image
        return {
            ...item,
            status: item?.status ? "Active" : "InActive",
            post_as_anonymous: item?.post_as_anonymous === 1 ? "Yes" : "No",
            logintype: item.source === 2 ? "Gmail id" : item.source === 3 ? "Facebook id" : "Manual"
        }
    })

    let csv = convertArrayOfObjectsToCSV(NewOne)
    if (csv === null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
}

const scrollDetails = {
    setScrollDetails({ scrollPosition, pageName }) {
        localStorage.setItem("scrollDetails", JSON.stringify({ scrollPosition: scrollPosition ?? 0, pageName: pageName ?? "" }))
    },
    getScrollDetails() {
        const scrollDetails = localStorage.getItem("scrollDetails") ?? "{}";
        return JSON.parse(scrollDetails)
    }
}


export {
    getLocalStorageKey,
    isAvatarSelectedCurr,
    setLocalStoragekey,
    resHandler,
    areAtLastPage,
    scrollToTop,
    exportToCsv,
    scrollDetails
}