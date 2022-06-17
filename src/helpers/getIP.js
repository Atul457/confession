import axios from "axios";

const getIP = async () => {
    try {
        const res = await axios.get("https://geolocation-db.com/json/")
        if (res.status) {
            localStorage.setItem("ip", res.data.IPv4)
        }
    } catch (err) {
        console.log({ err });
    }
}

export default getIP;