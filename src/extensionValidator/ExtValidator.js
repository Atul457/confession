export default function ExtValidator(props) {

    let fileName, ext, validExtensions;
    validExtensions = ["png","jpeg","gif","jpg"];
    fileName = props;
    fileName = fileName.name;
    
    ext = fileName;
    ext = ext.split(".");
    ext = ext[ext.length - 1];

    if (validExtensions.includes(ext))
    {
        return true;
    }else
    {
        return false;
    }
}
