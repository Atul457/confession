const getLocalStorageKey = key => {
    let value = localStorage.getItem(key) ?? false;
    return value;
}

export { getLocalStorageKey }