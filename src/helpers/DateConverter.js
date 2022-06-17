import moment from 'moment';

const convert = (convertedDate, originalDate) => {

    const arrCheck = ["minute", "minutes"]
    const obj = ["min", "mins"]
    let copyOrgData = originalDate;

    if (convertedDate === "a few seconds ago") {
        return convertedDate = "Just now"
    }

    if (convertedDate === "in a few seconds") {
        return convertedDate = "A few seconds ago"
    }


    convertedDate = convertedDate.toString().split(" ")
    let toMatch = convertedDate[1];
    let newArr = [];
    arrCheck.forEach((curr, index) => {
        if (toMatch === curr) {
            newArr = [{ curr, index }]
            return false;
        }
    })


    if (newArr.length) {
        let toBeReplaceWith = obj[newArr[0].index]
        originalDate = originalDate.replace(newArr[0].curr, toBeReplaceWith)
        copyOrgData = originalDate
    }


    copyOrgData = (copyOrgData.toString()).replace("a ", "1 ")
    copyOrgData = (copyOrgData.toString()).replace("an ", "1 ")
    return copyOrgData
}


const DateConverter = (date) => {
    let convertedDate = moment.utc(date.toString()).fromNow();
    convertedDate = convert(convertedDate.toString(), convertedDate.toString())
    return convertedDate
}

export default DateConverter