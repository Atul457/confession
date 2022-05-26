const SetAuth = (data) => {
    
    const dataG = data;
    if (dataG === 1) {
        localStorage.setItem("adminAuthenticated", "1");
    }
    else {
        localStorage.setItem("adminAuthenticated", "0");
        localStorage.removeItem("adminDetails");
    }
}

export default SetAuth;