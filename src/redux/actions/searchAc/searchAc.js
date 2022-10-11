const searchAcs = {
    "SEARCH_ALL": "SEARCH_FORUMS_AND_CONFESSIONS"
}

const searchAcFn = payload => {
    return {
        type: searchAcs.SEARCH_ALL,
        payload
    }
}

export {
    searchAcFn,
    searchAcs
}