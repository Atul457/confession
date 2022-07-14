const checkEmailProvided = (date) => {
    let usingFrom = new Date(date);
    let currentDate = new Date();
    let expiryTime = 7;

    if (usingFrom.getTime() < currentDate.getTime()) {
        const diffTime = Math.abs(currentDate - usingFrom);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > expiryTime)
        {
            return true;
        }
    }

}

export default checkEmailProvided;