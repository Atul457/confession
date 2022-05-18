const SetAuth = (data) => {
    const dataG = data;
    if (dataG === 1) {
        localStorage.setItem("authenticated", "1");
    }
    else {
        localStorage.setItem("authenticated", "0");
        localStorage.removeItem("userDetails");
    }
}

export default SetAuth;