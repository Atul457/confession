const jwt = require('jsonwebtoken');

function generateToken(userInfo)
{
    if(!userInfo)
        return null;
    return jwt.sign(userInfo, "confessionapp", {
        expiresIn: '365d'
    });
}

function destroyToken(token)
{
    if(!token)
        return null;
    jwt.destroy(token);
    return true;
}

module.exports.generateToken = generateToken;
module.exports.destroyToken = destroyToken;