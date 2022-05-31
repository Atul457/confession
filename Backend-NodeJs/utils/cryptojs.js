const crypto = require("crypto");
const algorithm = "aes-256-cbc"; 
let initVector = "2d855abbbe7604522a3cf32437a5d00f";//crypto.randomBytes(16);
initVector = Buffer.from(initVector, 'hex');
const Securitykey = "D(G+KbPeShVmYq3s6v9y$B&E)H@McQfT";
function getinitVector(string)
{
    return initVector.toString('hex');
}

function encryptStr(string)
{
    string = string.toString();
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(string, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
}

function decryptStr(string)
{
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(string, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}
module.exports.encryptStr = encryptStr;
module.exports.decryptStr = decryptStr;
module.exports.getinitVector = getinitVector;