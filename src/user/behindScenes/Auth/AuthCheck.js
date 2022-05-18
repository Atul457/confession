const auth = () => {

    const localStorageR = localStorage.getItem("authenticated");

    if (localStorageR === '' || localStorageR === null || localStorageR === '0') {
        localStorage.setItem("authenticated", "0");
        return (false);
    }
    else if (localStorageR === '1') {
        localStorage.setItem("authenticated", "1");
        return (true);
    }
    else {
        localStorage.setItem("authenticated", "0");
        return (false);
    }
}

export default auth;