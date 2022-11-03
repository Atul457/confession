import axios from "axios";


let live = "https://cloudart.com.au:3235/api/";
// let live = "https://apis.thetalkplace.com:3235/api/";

export const fetchData = async (props) => {

    let config = {
        baseURL: `${live}${props.url}`,
        method: props.method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            token: props.token,
            ip_address: localStorage.getItem("ip"),
        },
        data: props.data,
    }

    try {
        const response = await axios(config);
        if (response.data.status === true) {
            return response;
        } else {
            if (response.data.logout === true) {
                // console.log("do logout")
                localStorage.removeItem("authenticated");
                localStorage.removeItem("userDetails");
                window.location.href = "/login?message=1";
            }
            return response
        }
    } catch (error) {
        console.log(error);
        return error;
    }

}

