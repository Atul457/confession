import axios from "axios";

const instance = axios.create({
    baseURL: 'https://cloudart.com.au:3235/api/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

export default instance;