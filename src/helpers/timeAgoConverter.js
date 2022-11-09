function getFormattedDate(date, format) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    let _format = format;
    let otherDate = (new Date().toLocaleString('en-US', { timeZone: "UTC" })).toString();
    otherDate = otherDate.replace(",", "")
    otherDate = otherDate.replace(/-/g, "/")
    otherDate = new Date(otherDate.toString());
    let currentDate = otherDate;

    switch (_format) {
        case 1:
            return `${currentDate.getHours() - hours} ${(currentDate.getHours() - hours === 1) ? "hour" : "hours"} ago`;
        case 2:
            return `${currentDate.getDate() - day} ${(currentDate.getDate() - day === 1) ? " day" : "days"} ago`;
        case 3:
            return `${currentDate.getMonth() - month} ${currentDate.getMonth() - month === 1 ? "month" : "months"} ago`;
        case 4:
            return `${currentDate.getFullYear() - year} ${currentDate.getFullYear() - year === 1 ? "year" : "years"} ago`;

    }
    return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}


// MAIN FUNCTION
function timeAgo(dateParam) {
    if (!dateParam) {
        return "none";
    }

    const date = typeof dateParam === 'object' ? dateParam : (new Date(dateParam).replace(/-/g, "/"));
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000

    let otherDate = (new Date().toLocaleString('en-US', { timeZone: "UTC" })).toString();
    otherDate = otherDate.replace(",", "")
    otherDate = otherDate.replace(/-/g, "/")
    otherDate = new Date(otherDate.toString());
    
    const today = otherDate;

    let yesterday_ = (new Date(today - DAY_IN_MS).toLocaleString('en-US', { timeZone: "UTC" })).toString();
    yesterday_ = yesterday_.replace(",", "");
    yesterday_ = yesterday_.replace(/-/g, "/");
    yesterday_ = new Date(yesterday_.toString());
    const yesterday = yesterday_;
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisMonth = date.getMonth() === date.getMonth();
    const isThisYear = today.getFullYear() === date.getFullYear();


    if (seconds < 60) {
        return `just now`;                                          //JUST NOW
    }
    //  else if (seconds < 90) {
    //     return 'about a minute ago';                                //ABOUT A MINUTE AGO
    // }
     else if (minutes < 60 && date.getHours() === today.getHours()) {
        return `${minutes} mins ago`;                            //E.G. 59 A MINUTES AGO
    } else if (isToday) {
        return getFormattedDate(date, 1);                           //HOUR/HOURS AGO
    } else if (isYesterday) {
        return "yesterday";                                         // YESTERDAY
    } else if (isThisMonth && date.getMonth() === today.getMonth()) {
        return getFormattedDate(date, 2);                           // DAY/DAYS AGO
    } else if (isThisYear) {
        return getFormattedDate(date, 3);                           // MONTH/MONTHS AGO
    } else {
        return getFormattedDate(date, 4);                           // YEAR/YEARS AGO
    }
}

function timeAgoConverter(date) {
    return timeAgo(new Date((String(date)).replace(/-/g, "/")));
    // return timeAgo(new Date("2022-05-09 13:47:21"));
}

export default timeAgoConverter;