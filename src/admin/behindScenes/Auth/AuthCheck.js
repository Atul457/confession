const auth = () => {
    
    const localStorageR = localStorage.getItem("adminAuthenticated");

    if (localStorageR === '' || localStorageR === null || localStorageR === '0') {
        localStorage.setItem("adminAuthenticated", "0");
        return (false);
    }
    else if (localStorageR === '1') {
        localStorage.setItem("adminAuthenticated", "1");
        return (true);
    }
    else {
        localStorage.setItem("adminAuthenticated", "0");
        return (false);
    }
}

export default auth;