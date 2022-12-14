import toastMethods from "./components/Toaster";

const copyTextToClipboard = (text) => {
    var input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
        var successful = document.execCommand('copy');
        toastMethods.toaster2Info(successful ? "Copied successfully" : "Unable to copy");
    } catch (err) {
        toastMethods.toaster2Info("Unable to copy");
    }
    document.body.removeChild(input);
}

export { copyTextToClipboard }