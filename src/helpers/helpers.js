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

export { getLocalStorageKey, isAvatarSelectedCurr, setLocalStoragekey }