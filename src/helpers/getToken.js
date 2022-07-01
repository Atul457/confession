import auth from "../user/behindScenes/Auth/AuthCheck"
import { default as adminAuth } from "../admin/behindScenes/Auth/AuthCheck";

export const getToken = () => {
    let userData = '';
    if (auth()) {
        userData = localStorage.getItem("userDetails");
        userData = JSON.parse(userData).token;
    }
    return userData;
}

export const getAdminToken = () => {
    let adminDetails = '';
    if (adminAuth()) {
        adminDetails = localStorage.getItem("adminDetails");
        adminDetails = JSON.parse(adminDetails).token;
    }
    return adminDetails;
}