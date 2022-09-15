import auth from "../user/behindScenes/Auth/AuthCheck"

const updateKeyProfileLoc = (key, value, isToken = false) => {
    let userDetails = localStorage.getItem("userDetails")
    if (!userDetails) userDetails = {}
    userDetails = JSON.parse(userDetails)
    if (isToken) userDetails = { ...userDetails, token: value }
    userDetails = { ...userDetails, profile: { ...userDetails.profile, [key]: value } }
    localStorage.setItem("userDetails", JSON.stringify(userDetails))
}

const getKeyProfileLoc = (key, isToken = false) => {
    let userData = '';
    userData = localStorage.getItem("userDetails");
    userData = JSON.parse(userData);
    if (auth()) userData = isToken ? (userData?.token ?? "not found") : userData.profile[key]
    return userData;
}

export { updateKeyProfileLoc, getKeyProfileLoc }