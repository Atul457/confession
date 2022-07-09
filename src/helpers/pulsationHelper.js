import moment from "moment";

export const pulsationHelper = () => {
    let nodes = document.querySelectorAll('[pulsate]');
    let data, result;
    nodes.forEach(curr => {
        data = curr.getAttribute('pulsate')
        let [date, classes] = data.split(',');
        if (date) {
            date = moment(date, 'DD-MM-YYYY').add(30, 'days');
            result = date.isAfter(moment());
            if (!result) return false;
            if (!classes) return false;
            if(curr.className.includes(classes)) return false;
            curr.setAttribute('class', curr.getAttribute('class') + ' ' + classes);
        }
    })
}