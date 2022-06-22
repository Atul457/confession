import auth from "../user/behindScenes/Auth/AuthCheck"

export const getToken = () => {
    let userData = '';
    if (auth()) {
        userData = localStorage.getItem("userDetails");
        userData = JSON.parse(userData).token;
    }
    return userData;
}